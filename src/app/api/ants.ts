import { CartItemProps } from '../api/cart';
import { OrderProps } from '../api/orders';

const antsAnalytic = typeof window !== 'undefined' && location.host === 'www.leflair.vn' ? (window as any)['ants_analytic'] || {
  push: () => {}
} : {
  push: (...args: any[]) => console.log('Ants', args)
};

const conversionId = 'dcd85ed5';

export const viewHomepage = () => antsAnalytic.push({
  conversionId, 
  customParams: [{
    ecomm_pagetype: 'home'
  }]
});

export const viewContent = (productId: string) => antsAnalytic.push({
  conversionId, 
  customParams: [{
    ecomm_prodid: productId,
    ecomm_pagetype: 'product'
  }]
});

export const viewCart = (products: CartItemProps[]) => antsAnalytic.push({
  conversionId, 
  customParams: [{
    ecomm_pagetype: 'cart',
    ecomm_quantity: products.reduce((sum, p) => sum + p.quantity, 0),
    ecomm_totalvalue: products.reduce((sum, p) => sum + p.quantity * p.salePrice, 0)
  }]
});

export const captureOrder = (order: OrderProps) => antsAnalytic.push({
  conversionId, 
  customParams: [{
    ecomm_pagetype: 'purchase',
    ecomm_quantity: order.products.reduce((sum, p) => sum + p.quantity, 0),
    ecomm_totalvalue: order.products.reduce((sum, p) => sum + p.quantity * p.salePrice, 0)
  }]
});
