import * as React from 'react';
import { Location, History } from 'history';
import createHistory from 'history/createBrowserHistory';
import * as pathToRegexp from 'path-to-regexp';

import { aboutUsAction, careersAction, partnersAction, ggAction, subLandingPageAction, partnersCitibankAction, partnersVPBankAction, partnersMasterCardAction, secretSalesCompAction } from './pages';
import { homeAction } from './home';
import { Error, NotFound } from './error';
import { saleAction, upcomingSaleAction } from './sale';
import {
  settingsAction, ordersAction, cardsAction,
  addressesAction, AccountAddresses, CheckoutAddresses, checkoutAddressAction,
  createAddressAction, AccountCreateAddress, CheckoutCreateAddress,
  editAddressAction, AccountEditAddress, CheckoutEditAddress,
  CreateGuestAddress, editGuestAddressAction
} from './account';
import {
    signinAction, forgotPasswordAction, registerAction, resetPasswordAction
} from './auth';
import { productAction } from './product';
import { checkoutAction, continueAction, thankYouAction, LoadingScreen as CheckoutLoader } from './checkout';
import { categoryAction } from './category';
import { secretSaleAction } from './secret-sale';
import { secretSalesPageAction } from './secret-sale/secret-sales-page';

import { isSignedIn, getUser, initLanguage, initData } from './redux/user.redux';
import { checkSecretSaleStatus } from './redux/home.redux';
import { ROUTE_CHANGE, middleware } from './redux/middleware';
import { envLookup } from '.';

const middlewares: Array<any> = [
    middleware
];

export const history: History | { push: any, goBack: any, replace: any, replaceState: any, scrollRestoration?: string } = typeof document !== 'undefined' ? createHistory() : {
    push: () => {},
    goBack: () => {},
    replace: () => {},
    replaceState: () => {}
};

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}

let unlisten: null | Function;

type Auth = {
    [key: string]: boolean
};

export type Meta = {
    title?: string,
    description?: string,
    url?: string,
    image?: string
};

export type ActionRouteReturn = {
    component: any,
    meta?: Meta
};

type ActionRoute = {
    path: string | RegExp;
    action: Function,
    loadScreen?: any,
    keys?: Array<any>,
    auth?: Auth
};

type ComponentRoute = {
    path: string | RegExp;
    component: React.ComponentType<any>,
    loadScreen?: any,
    keys?: Array<any>,
    auth?: Auth
};

export const routes: Array<ActionRoute | ComponentRoute> = [
    /* Begin app routes */
    { path: '/', action: homeAction },
    { path: '/sales/upcoming/:saleId', action: upcomingSaleAction },
    { path: '/sales/secret-sales', action: secretSalesPageAction },
    { path: '/sales/:saleId', action: saleAction },
    { path: '/pages/about-us', action: aboutUsAction },
    { path: '/pages/careers', action: careersAction },
    { path: '/pages/partners', action: partnersAction },
    { path: '/pages/genuine-guarantee', action: ggAction },
    { path: '/subscription', action: subLandingPageAction },
    { path: '/reactivation', action: subLandingPageAction },
    { path: '/citi-bank', action: partnersCitibankAction },
    { path: '/vpbank', action: partnersVPBankAction },
    { path: '/hsbc-mastercard', action: partnersMasterCardAction },
    { path: '/secret-sales', action: secretSalesCompAction },
    { path: '/account/settings', action: settingsAction, auth: { requiresSignedIn: true } },
    { path: '/account/orders', action: ordersAction, auth: { requiresSignedIn: true } },
    { path: '/account/addresses', action: addressesAction(AccountAddresses), auth: { requiresSignedIn: true } },
    { path: '/account/addresses/:type/create', action: createAddressAction(AccountCreateAddress), auth: { requiresSignedIn: true } },
    { path: '/account/addresses/:type/:addressId/edit', action: editAddressAction(AccountEditAddress), auth: { requiresSignedIn: true } },
    { path: '/account/cards', action: cardsAction, auth: { requiresSignedIn: true } },
    { path: '/auth/signin', action: signinAction, auth: { requiresSignedOut: true } },
    { path: '/auth/register', action: registerAction, auth: { requiresSignedOut: true } },
    { path: '/auth/forgot-password', action: forgotPasswordAction, auth: { requiresSignedOut: true } },
    { path: '/auth/reset-password/:token', action: resetPasswordAction, auth: { requiresSignedOut: true } },
    { path: '/products/:productId', action: productAction },
    { path: '/cart/addresses/:type', action: checkoutAddressAction },
    { path: '/cart/addresses/:type/guest/create', action: createAddressAction(CreateGuestAddress) },
    { path: '/cart/addresses/:type/guest/edit', action: editGuestAddressAction},
    { path: '/cart/addresses/:type/create', action: createAddressAction(CheckoutCreateAddress) },
    { path: '/cart/addresses/:type/:addressId/edit', action: editAddressAction(CheckoutEditAddress), auth: { requiresSignedIn: true } },
    { path: '/cart/checkout', action: checkoutAction, loadScreen: <CheckoutLoader /> },
    { path: '/cart/checkout/thank-you/:code', action: thankYouAction },
    { path: '/checkout/continue', action: continueAction },
    { path: '/:category', action: categoryAction },
    { path: '/s/:name', action: secretSaleAction }
    /* End app routes */
];

const clientRoutes = routes.map((route: any): ActionRoute | ComponentRoute => {
    route.keys = [];
    
    // We need to clone the route object so that the server app receives the plain path string
    return Object.assign({}, route, {
        path: pathToRegexp(route.path, route.keys)
    });
});

const resolve = (path: string) => {
    const routeDef = clientRoutes.find(route => (route.path as RegExp).exec(path) !== null);
    
    return routeDef || { path: new RegExp(path), component: NotFound, keys: new Array() };
}

export const isBrowserHistory = (historyObj: History | {}): historyObj is History => (historyObj as History).listen !== undefined;
export const isActionRoute = (route: ActionRoute | ComponentRoute): route is ActionRoute => (route as ActionRoute).action !== undefined;
export const isComponentRoute = (route: ActionRoute | ComponentRoute): route is ComponentRoute => (route as ComponentRoute).component !== undefined;

// Scroll Handling
const scrollStack: Array<number> = [];

const handleAction = (type: string) => {
    if (typeof window === 'undefined') {
        return;
    }
    
    if (type === 'POP') {
        return setTimeout(() => {
            var height = scrollStack.pop();
            window.scrollTo(0, height);
        }, 500);
    }
    
    if (type === 'PUSH') {
        window.scrollTo(0, 0);
    }
};

const auth = (auth: Auth, state: any): boolean => {
    if (auth) {
        // not signed in yet
        if (!isSignedIn(state)) {
            if (auth.requiresSignedIn === true) {
                const redirect = `${location.pathname}${location.search || ''}`;
                
                history.push(`/auth/signin${redirect ? `?redirect=${redirect}` : ''}`);
                return false;
            }
        } else {
            // signed in
            if (auth.requiresSignedOut === true) {
                history.push('/');
                return false;
            }
        }
    }
    
    return true;
};

// Main router function
let firstLoad = false;
export const router = (store: any, render: Function) => {
    const stack = middlewares.map(mw => mw(store))
        .reduce((stack, mw) => (...args: any[]) => stack(mw(...args)));
    
    if (unlisten) {
        unlisten();
    }
    
    const handler = async (location: Location, action?: string) => {
        if (action && action === 'PUSH') {
            scrollStack.push((window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0));
        }
        
        const route = resolve(location.pathname);
        const params = (route.path as RegExp).exec(location.pathname);
        const keyedParams = route.keys ? route.keys.reduce((result, key, index) => {
            result[key.name] = params[index + 1];
            
            return result;
        }, {}) : {};
        
        if (!firstLoad) {
            store.dispatch(initLanguage(store.getState()));
            store.dispatch(checkSecretSaleStatus(store));

            // this solves dev env & reload data if preloaded state is null
            if (typeof window !== 'undefined' && (!envLookup[window.location.host] || !(window as any).__PRELOADED_STATE__ || !Object.keys((window as any).__PRELOADED_STATE__).length)) {
                await store.dispatch(initData());
            }
            firstLoad = true;
        }
        
        // authorize route
        if (!auth(route.auth, store.getState())) {
            return;
        }
        
        stack(async (reduxAction: any) => {
            // handle component route
            if (isComponentRoute(route)) {
                const Component = route.component;
                
                render(<Component params={keyedParams} />, store);
                
                return handleAction(action);
            }
            
            // handle action route
            if (isActionRoute(route)) {
                if (route.loadScreen) {
                    render(route.loadScreen, store);
                }
                
                try {
                    const actionReturn: ActionRouteReturn = await route.action(keyedParams, null, store);
                    
                    if (!actionReturn) {
                        return;
                    }
                    
                    render(actionReturn.component);
                    
                    return handleAction(action);
                } catch (e) {
                    render(<Error />, store);
                    
                    console.error(e);
                    
                    return handleAction(action);
                }
            }
            
            // handle not found
            render(<NotFound />, store);
            
            return handleAction(action);
        })({
            type: ROUTE_CHANGE,
            route
        });
    };
    
    if (isBrowserHistory(history)) {
        unlisten = history.listen(handler);
        
        handler(history.location);
    }
};
