import 'core-js/shim';
import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { I18nextProvider } from 'react-i18next';
import { Provider } from "react-redux";
import * as Raven from 'raven-js';
import { StripeProvider } from 'react-stripe-elements';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

import { default as App } from '../app';
import { router } from '../app/router';
import i18n from './i18n';
import { registerOnUpdateLangCallback } from '../app/redux/user.redux';
import * as version from '../app/api/version';
import { envLookup } from '../app';

import store from '../app/redux';
import { request } from '../app/api/api';

request.onStart(() => store.dispatch(showLoading()));
request.onSuccess(() => store.dispatch(hideLoading()));
request.onError(() => store.dispatch(hideLoading()));

registerOnUpdateLangCallback((lang: string) => {
  i18n.changeLanguage(lang);
});

const getRenderer = (Main: any) => (component: any) => render((
  <StripeProvider apiKey={typeof window !== 'undefined' && location.host === 'www.leflair.vn' ? 'pk_live_flRNrR5VWD6lng3v73WHfWLZ' : 'pk_test_U7tHqB4u2RLK4S9mkR439QzA'}>
    <Provider store={store}>
      <AppContainer>
        <I18nextProvider i18n={i18n}>
          <Main>
            { component }
          </Main>
        </I18nextProvider>
      </AppContainer>
    </Provider>
  </StripeProvider>
), document.getElementById('root'));

router(store, getRenderer(App));

if (process.env.NODE_ENV !== 'production' && (module as NodeModule & { hot?: any }).hot) {
  (module as NodeModule & { hot?: any }).hot.accept('../app/router', () => {
    const router = require('../app/router').default;
    router(store, getRenderer(App));
  });
}
const sentryEnv = typeof window !== 'undefined' ? envLookup[location.host] || 'local' : 'server';
Raven
  .config('https://4e31686d715f470bb20e152d4ca2fc4e@sentry.leflair.io/10', {
    environment: sentryEnv,
    shouldSendCallback: () => sentryEnv !== 'local',
    ignoreErrors: [
      // These errors are caused by browser extensions and Chrome's autocomplete, not our code
      /^Blocked a frame with origin/,
      /^zaloJSV2/
    ]
  })
  .install();

// version check - force reload if changed
if (envLookup[location.host]) {
  const interval = 10 * 60 * 1000;  // 10 mins
  setInterval(async () => {
    try {
      const { reload } = await version.check((window as any).version);
  
      if (reload) {
        location.reload(true);
      }
    } catch(error) {
      console.log(error);
    }
  }, interval);
}
