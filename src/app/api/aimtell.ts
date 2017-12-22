const cartAbandonedInterval = 30;

const _aimtellAbandonedCart: Function = typeof window !== 'undefined' && location.host === 'www.leflair.vn' ? (window as any)['_aimtellAbandonedCart'] || (() => { }) : (...args: any[]) => console.log('_aimtellAbandonedCart:', args);

export const addToCart = () => {
    if (_aimtellAbandonedCart) {
        _aimtellAbandonedCart('add-to-cart', cartAbandonedInterval);
    }
}

export const finishCheckout = () => {
    if (_aimtellAbandonedCart) {
        _aimtellAbandonedCart('order-complete');
    }
}
