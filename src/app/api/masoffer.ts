import { OrderProps, ProductProps } from './orders';
import * as md5 from 'md5';
import * as Cookies from 'js-cookie';

import { isGuest } from '../redux/user.redux';

const cname = 'mo_traffic_id';
const token = 'kNw6zXK62XT8*zCu';
const offer_id = 'leflair';

const getTrafficId = () => typeof window !== 'undefined' && location.host === 'www.leflair.vn' ? Cookies.get('mo_traffic_id') : false;

export const captureOrder = (store: any, order: OrderProps) => {
  const traffic_id = getTrafficId();
  if (!traffic_id) {
    return;
  }

  const signature = md5(`${token}${offer_id}${order.code}${order.createdTimestamp}`);

  // Set global var containing order data
  (<any>window).masoffer_order_info = {
    signature,
    traffic_id,
    offer_id,
    transaction_id: order.code,
    transaction_time: order.createdTimestamp,
    products: order.products.map((product: ProductProps, index: number) => ({
      id: `00${index}`.substr(-3),
      sku: product.productId,
      url: `https://leflair.vn/products/${product.productId}`,
      price: product.salePrice,
      name: product.title,
      category_id: isGuest(store.getState()) ? 1 : 2,
      status_code: 0,
      quantity: product.quantity
    }))
  };
  
  // Embed tracking script
  const masScript = document.createElement("script");
  masScript.setAttribute('src', 'https://static.masoffer.net/php/tracking_js.php?type=general');
  document.body.appendChild(masScript);
};

export const setTrafficId = (trafficId: string) => {
  if (typeof window !== 'undefined' && location.host === 'www.leflair.vn') {
    Cookies.set('mo_traffic_id', trafficId, { expires: 30 });
  }
};
