import { $get, $post } from './api';


/* constants */
const PATH = 'checkout';


/* api calls */
export const getCheckout = async () => {
  const res = await $get(`${PATH}`);
  
  return res;
};

export const updateFailedCheckout = async(orderCode: string, errorMsg: string) => {
  const res = await $post(`${PATH}/order/failed-attempt`, JSON.stringify({
    orderCode,
    errorMsg 
  }));

  return res;
};

export const checkout = async (data: any) => {
  const res = await $post(`${PATH}`, JSON.stringify(data));
  
  return res;
};

export const reCheckout = async (code: string, data: any) => {
  const res = await $post(`${PATH}/order/${code}`, JSON.stringify(data));
  
  return res;
};
