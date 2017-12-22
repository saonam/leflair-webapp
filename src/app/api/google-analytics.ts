import { UserProps } from '../api/account';
import { OrderProps, ProductProps } from '../api/orders';

const noop = () => {};

let _ga: Function = typeof window !== 'undefined' ? (window as any)['ga'] || noop : noop;

const ga = (...args: any[]) => {
  if (typeof window !== 'undefined' && _ga === noop) {
    _ga = (window as any)['ga'] || noop;
  }

  // This is here if we need to add a prefix to our commands in the future
  _ga(...args);
};

export const trackPageView = (url: string) => {
  ga('set', 'page', url);
  ga('send', 'pageview');
};

export const setUser = (user: UserProps) => {
  ga('set', 'userId', user.id);
};

export const captureOrder = (order: OrderProps) => {
  ga('ecommerce:addTransaction', {
    id: order.code,
    affiliation: 'Leflair',
    revenue: order.paymentSummary.total,
    shipping: order.paymentSummary.shipping,
    tax: 0,
    currency: 'VND'
  });

  order.products.forEach((product: ProductProps) => ga('ecommerce:addItem', {
    id: order.code,
    name: product.title,
    price: product.salePrice,
    quantity: product.quantity,
    currency: 'VND'
  }));

  ga('ecommerce:send');

  ga('send', 'event', {
    eventCategory: 'Commands',
    eventLabel: 'Checkout success',
    eventAction: 'checkoutSuccess'
  });
  
  if (order.isFirstOrder) {
    firstOrder();
  }
};

export const addToCart = () => {
  ga('send', 'event', {
    eventCategory: 'Commands',
    eventLabel: 'Add to cart',
    eventAction: 'addToCart'
  });
};

export const beginCheckout = () => {
  ga('send', 'event', {
    eventCategory: 'Commands',
    eventLabel: 'Begin Checkout',
    eventAction: 'beginCheckout'
  });
};

export const firstOrder = () => {
  ga('send', 'event', {
    eventCategory: 'Commands',
    eventLabel: 'First Order',
    eventAction: 'firstOrder'
  });
};

export const subscribe = () => {
  ga('send', 'event', {
    eventCategory: 'Commands',
    eventLabel: 'Subscribe',
    eventAction: 'subscribe'
  });
};

export const signin = () => {
  ga('send', 'event', {
    eventCategory: 'Commands',
    eventLabel: 'Signin',
    eventAction: 'signin'
  });
};

export const signup = () => {
  ga('send', 'event', {
    eventCategory: 'Commands',
    eventLabel: 'Signup',
    eventAction: 'signup'
  });
};

ga('require', 'ecommerce');
