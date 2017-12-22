import * as Cookies from 'js-cookie';

import { OrderProps, setAccessTradeOrder } from '../api/orders';

const getTrackingId = () => typeof window !== 'undefined' && location.host === 'www.leflair.vn' ? Cookies.get('_aff_sid') : null;

export const captureOrder = async (order: OrderProps) => {
  const trackingId = getTrackingId();

  if (!trackingId) {
    return;
  }

  await setAccessTradeOrder({
    code: order.code,
    trackingId
  });
};
