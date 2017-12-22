import * as qs from 'qs';

import * as GoogleAnalytics from '../api/google-analytics';
import * as FacebookPixel from '../api/facebook-pixel';
import * as Criteo from '../api/criteo';
import * as MasOffer from '../api/masoffer';
import * as Aimtell from '../api/aimtell';
import * as Ematic from '../api/ematic';
import * as Ants from '../api/ants';

import { ADD_CART_ITEM } from './cart.redux';
import { INIT_DATA, SIGN_IN, REGISTER, SUBSCRIBE } from './user.redux';
import { closeCart } from './cart.redux';

export const ROUTE_CHANGE = 'ROUTE_CHANGE';

const handleRouteChange = (route: any, store?: any) => {
  document.title = 'Leflair Vietnam - Đại tiệc hàng hiệu'; // Set default title 

  if (store) {
    store.dispatch(closeCart()); // Close cart on route change
  }

  // homepage
  if (route.path.exec('/')) {
    Criteo.viewHomepage();
    Ants.viewHomepage();
  }

  // checkout
  if (route.path.exec('/cart/checkout')) {
    GoogleAnalytics.beginCheckout();
    FacebookPixel.beginCheckout();
  }

  if (typeof window !== 'undefined') {
    GoogleAnalytics.trackPageView(location.pathname);

    const { utm_source, traffic_id } = qs.parse(location.search.replace('?', ''));
    if (utm_source === 'masoffer' && traffic_id) {
      MasOffer.setTrafficId(traffic_id);
    }
  }
};

export const middleware = (store: any) => (next: Function) => (action: any) => {
  switch(action.type) {
    // redux actions
    case INIT_DATA:
      if (action.user) {
        GoogleAnalytics.setUser(action.user);
        Criteo.setUser(action.user);
        Ematic.init(action.user.email);
      }
      break;
    case ADD_CART_ITEM:
      GoogleAnalytics.addToCart();
      if (action.cartItem) {
        const id = action.cartItem.productContentId + (action.color ? `_${action.color.name}` : '');
        FacebookPixel.addToCart(action.cartItem.salePrice, id);
      }
      Aimtell.addToCart();
      break;
    case SIGN_IN:
      if (action.user) {
        GoogleAnalytics.setUser(action.user);
        GoogleAnalytics.signin();
        Ematic.init(action.user.email);
        Criteo.setUser(action.user);
      }
      break;
    case REGISTER:
      GoogleAnalytics.signup();
      FacebookPixel.completeRegistration();
      break;
    case SUBSCRIBE:
      FacebookPixel.captureLead(action.context);
      GoogleAnalytics.subscribe();
      break;

    // route actions
    case ROUTE_CHANGE:
      handleRouteChange(action.route, store);
      break;
  }

  next(action);
};
