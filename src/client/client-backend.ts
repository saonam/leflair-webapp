import * as XHRBackend from 'i18next-xhr-backend';

declare global {
    interface Window { __i18n: any; }
}

export class ClientBackend extends (<any>XHRBackend) {
    read(language: string, namespace: string, callback: Function) {
        if (!(window.__i18n && window.__i18n[language] && window.__i18n[language][namespace])) {
            return super.read(language, namespace, callback);
        }

        callback(null, window.__i18n[language][namespace]);
    }

    readMulti(language: string, namespace: string, callback: Function) {
        if (!(window.__i18n && window.__i18n[language] && window.__i18n[language][namespace])) {
            return super.read(language, namespace, callback);
        }

        callback(null, window.__i18n[language][namespace]);
    }
}