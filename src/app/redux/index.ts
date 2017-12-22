import { createStore, combineReducers, applyMiddleware, compose as reduxCompose } from 'redux';
import thunk from 'redux-thunk';

import { middleware } from './middleware';

import { loadingBarReducer } from 'react-redux-loading-bar';

import { addressReducer } from './address.redux';
import { userReducer } from './user.redux';
import { cartReducer } from './cart.redux';
import { categoriesReducer } from './categories.redux';
import { homeReducer } from './home.redux';
import { locationsReducer } from './locations.redux';
import { alertReducer } from './alert.redux';

const compose = typeof window !== 'undefined' ? (<any>window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || reduxCompose : reduxCompose;

export const configureStore = () => {
  const rootReducer = combineReducers({
    address: addressReducer,
    user: userReducer,
    cart: cartReducer,
    categories: categoriesReducer,
    home: homeReducer,
    locations: locationsReducer,
    loadingBar: loadingBarReducer,
    alert: alertReducer
  });

  // Grab the state from a global variable injected into the server-generated HTML
  const preloadedState = typeof window !== 'undefined' ? (window as any).__PRELOADED_STATE__ : {};

  // Allow the passed state to be garbage-collected
  if (typeof window !== 'undefined') {
    delete (window as any).__PRELOADED_STATE__;
  }

  return createStore(
    rootReducer,
    preloadedState,
    compose(applyMiddleware(thunk, middleware))
  );
}

export default configureStore();
