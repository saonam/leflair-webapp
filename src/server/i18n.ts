import * as i18next from 'i18next';
import { LanguageDetector, handle } from 'i18next-express-middleware';
import * as i18nextBackend from 'i18next-node-fs-backend';

export const DEFAULT_LANG = 'vn';

const instance = i18next
    .use(LanguageDetector)
    .use(i18nextBackend)
    .init({
        backend: {
            // This is relative to the `dist` directory
            loadPath: `${__dirname}/public/locales/{{lng}}/{{ns}}.json`
        },
        fallbackLng: DEFAULT_LANG,
        preload: ['vn', 'en'],
        ns: ['account', 'auth', 'cart', 'category', 'checkout', 'common', 'home', 'orders', 'page', 'products', 'sales','subscription'],
        defaultNS: 'common',
        saveMissing: false
    });

export default handle(instance);
