import { $get } from './api';


/* constants */
const PATH = 'credit-cards';


/* props definition */
export type CreditCardProps = {
    id: string,
    type: string,
    lastDigits: string,
    cardholderName: string,
    expirationDate: Date,
    default: boolean,
    provider?: string
};


/* api calls */
export const getCreditCards = async (cookie?: any) => {
  const res = await $get(`${PATH}`, cookie);
  
  return res;
};
