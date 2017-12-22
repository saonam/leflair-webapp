import { $get, $put } from './api';


/* constants */
const PATH = 'giftcards';


/* api calls */
export const getGiftCard = async (code: string) => {
  const res = await $get(`${PATH}/${code}`);
  
  return res;
};

export const redeemGiftCard = async (code: string) => {
  const res = await $put(`${PATH}/${code}`);
  
  return res;
};
