import './polyfill';
import { readdirSync, readFileSync } from 'fs';
import * as express from 'express';
import { static as staticMiddleware, Router } from 'express';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { I18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import * as Raven from 'raven';
import * as session from 'express-session';
import * as initRedisStore from 'connect-redis';
import * as cookieParser from 'cookie-parser';

// Server Dependencies
import i18nMiddleware from './i18n';
import { default as template } from './template';

// React Application
import App from '../app/index';
import { notFoundAction } from '../app/error';
import { configureStore } from '../app/redux';
import { initData } from '../app/redux/user.redux';
import { Meta, ActionRouteReturn, routes, isActionRoute, isComponentRoute } from '../app/router';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

// Load translation files
// This is relative to the `dist` directory
const locales: string = JSON.stringify(readdirSync(`${__dirname}/public/locales`).reduce((compiled: {[index: string]: any}, locale) => {
  compiled[locale] = readdirSync(`${__dirname}/public/locales/${locale}`).reduce((namespaces: {[index: string]: any}, filename) => {
      const match = /^(.+).json$/.exec(filename);

      if (!match) {
        return namespaces;
      }

      namespaces[match[1]] = JSON.parse(readFileSync(`${__dirname}/public/locales/${locale}/${filename}`).toString());

      return namespaces;
    }, {});

  console.log(`Loaded locale "${locale}" with ${compiled[locale].length} translation namespaces`);

  return compiled;
}, {}));

const render = (component: React.ReactNode, request: express.Request & { i18n: I18n, store: any }, meta?: Meta) => {
  const html = renderToString(
    <Provider store={request.store}>
      <I18nextProvider i18n={request.i18n}>
        <App>
          { component }
        </App>
      </I18nextProvider>
    </Provider>
  );

  return template(html, meta, locales, request.store.getState());
};

const sentryClient = Raven.config(process.env.SENTRY_DSN, {
  environment: process.env.NODE_ENV,
  release: process.env.GIT_HASH,
  tags: {
    context: 'server'
  }
}).install();

process.on('unhandledRejection', (reason) => sentryClient.captureException(reason));

const app: any = express();

app.use(sentryClient.requestHandler());
app.use(i18nMiddleware);
app.use(staticMiddleware(`${__dirname}/public`));

const RedisStore: any = initRedisStore(session);

const redisStore = new RedisStore({
  host: process.env.REDIS_SERVICE_HOST,
  port: process.env.REDIS_SERVICE_PORT,
  db: process.env.REDIS_DATABASE,
  pass: process.env.REDIS_PASSWORD,
  logErrors: true
});

app.use(cookieParser());
app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: process.env.NODE_ENV === 'production' ? {
    // tslint:disable-next-line:no-magic-numbers
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: true,
    httpOnly: true
  } : null,
  proxy: true
}));

app.use(async (req: express.Request & { store: any }, res: express.Response, next: express.NextFunction) => {
  const store = configureStore();
  await store.dispatch(initData(req.headers.cookie));
  req.store = store;

  next();
});

// version change detector
app.use('/version/:version', (req: express.Request, res: express.Response, next: express.NextFunction) => res.json({ reload: req.params.version !== process.env.RELEASE }));

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.hostname === 'leflair.vn') {
    return res.redirect(`https://www.${req.hostname}${req.originalUrl}`);
  }

  next();
});

const router = routes.reduce((r, route) => {
    r.get(route.path, async (req: express.Request & {i18n: I18n, language: string, store: any}, res) => {
        if (isComponentRoute(route)) {
            const Component = route.component;
            const html = await render(<Component params={{...req.params, ...req.query}} />, req);

            return res.send(html);
        }

        try {
          const { component, meta }: ActionRouteReturn = await route.action({ ...req.params, ...req.query }, req.headers.cookie, req.store);
          const url = req.protocol + '://' + req.get('host') + req.originalUrl;
          const html = await render(component, req, { url, ...meta });
  
          res.send(html);
        } catch (e) {
          // It's an authenticated endpoint or otherwise unable to be rendered
          // shit the bed and let the client clean up after us
          res.send(template('', {}, locales, {}));

          sentryClient.captureException(e);
          sentryClient.captureMessage('Failed to render server-side', {
            level: 'warning',
            extra: {
              path: req.path
            }
          });
        }
    });

    return r;
}, Router());

/**
 * This route must be the last route declared. It will catch
 * any requests not handled by previous routes and render the
 * 404 page.
 */
router.use('*', async (req: express.Request & {i18n: I18n, language: string, store: any}, res) => {
    const { component, meta }: ActionRouteReturn = await notFoundAction(req.params);
    const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const html = await render(component, req, { url, ...meta });
    
    res.send(html);
});

app.use(router);
app.use(sentryClient.errorHandler());

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Listening on 0.0.0.0:${port}`);
    console.log(`Serving static content from ${__dirname}/public`);
});
