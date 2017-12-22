import { $get, $post } from './api';
import { AddressProps } from './addresses';
import { CreditCardProps } from './credit-cards';


/* constants */
const PATH = 'user-orders';


/* props definition */
export type OrderProps = {
    id: string,
    code: string,
    paymentSummary?: PaymentSummaryProps,
    address?: {
      shipping: AddressProps,
      billing?: AddressProps,
    },
    status: string,
    products?: ProductProps[],
    createdDate: Date,
    createdTimestamp: number,
    shippedDate?: Date,
    deliveredDate?: Date,
    tracking?: string,
    isFirstOrder?: boolean
};

type PaymentSummaryProps = {
    method: string,
    subtotal: number,
    shipping: number,
    total: number,
    accountCredit: number,
    card?: CreditCardProps
};

export type ProductProps = {
    id: string,
    productId: string,  // productContentId
    title: string,
    image: string,
    retailPrice: number,
    salePrice: number,
    quantity: number,
    totalSalePrice: number,
    returnable: boolean,
    type: string,
    color?: string,
    size?: string
};


/* api calls */
export const getOrders = async (cookie?: any) => {
  const res = await $get(`${PATH}`, cookie);
  
  return res;
};

export const getOrder = async (id: string, cookie?: any) => {
  // the id can be an id or a code
  const res = await $get(`${PATH}/${id}`, cookie);
  
  // and the res can be an order object or an array
  return res;
};

export const setAccessTradeOrder = async (body: any) => {
  const res = await $post(`${PATH}/accesstrade`, JSON.stringify(body));
  
  return res;
};
