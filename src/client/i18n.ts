import * as i18n from 'i18next';
import { ClientBackend } from './client-backend';

// use require instead of import because `Couldn't find package "@types/i18next-localstorage-cache" on the "npm" registry.`
// const Cache = require('i18next-localstorage-cache');

export const DEFAULT_LANG = 'vn';

i18n
  .use(ClientBackend)
  // .use(Cache)
  .init({
    fallbackLng: DEFAULT_LANG,
    wait: true, // globally set to wait for loaded translations in translate hoc

    // have a common namespace used around the full app
    ns: ['account', 'auth', 'cart', 'category', 'checkout', 'common', 'home', 'orders', 'page', 'products', 'sales','subscription'],
    defaultNS: 'common',
    whitelist: ['vn', 'en'],
    // cache: {
    //   enabled: typeof window !== 'undefined' && location.host === 'www.leflair.vn',
    //   prefix: 'i18next_res_',
    //   expirationTime: 7*24*60*60*1000,
    //   versions: {
    //     vn: 'v1.0',
    //     en: 'v1.0'
    //   }
    // },
    debug: typeof window !== 'undefined' && location.host !== 'www.leflair.vn',

    interpolation: {
      escapeValue: false, // not needed for react!!
    }
  });


export default i18n;
