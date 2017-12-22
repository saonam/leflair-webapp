import { OrderProps, ProductProps } from './orders';


const fbq: Function = typeof window !== 'undefined' && location.host === 'www.leflair.vn' ? (window as any)['fbq'] || (() => {}) : (...args: any[]) => console.log('fbq:', args);

export const addToCart = (price: number, product: string) => {
  fbq('track', 'AddToCart', {
    value: price,
    currency: 'VND',
    content_ids: product,
    content_type: 'product'
  });
};

export const beginCheckout = () => {
  fbq('track', 'InitiateCheckout');
};

export const viewContent = (value: number, name: string, id: string) => {
  fbq('track', 'ViewContent', {
    content_ids: id,
    content_type: 'product',
    value,
    currency: 'VND'
  });
};

export const captureOrder = (order: OrderProps) => {
  const contentIds: Array<string> = order.products.map((p: ProductProps) => {
    return `${p.productId}${p.color || p.size ? `_${p.color || p.size}` : ''}`;
  });

  fbq('track', 'Purchase', {
    content_ids: contentIds,
    content_type: 'product',
    value: order.paymentSummary.total,
    currency: 'VND'
  });
};

export const captureLead = (context: string) => {
  fbq('track', 'Lead', {
    content_name: context
  });
}

export const completeRegistration = () => {
  fbq('track', 'CompleteRegistration');
};
