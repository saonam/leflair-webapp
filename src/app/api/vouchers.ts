import { $get } from './api';


/* props */
export type VoucherProps = {
  id: string,
  code: string,
  discountType: string,
  // discounts
  amount: number,
  freeShipping: boolean,
  // constrains
  minimumPurchase: number,
  binRange: number[][]
}


/* constants */
const PATH = 'vouchers';


/* api calls */
export const getVoucher = async (code: string) => {
  const res = await $get(`${PATH}/${code}`);
  
  return res;
};
