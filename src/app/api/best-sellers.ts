import { $get } from './api';


/* constants */
const PATH = 'best-sellers';


/* api calls */
export const getBestSellers = async (cookie?: any) => {
  const res = await $get(`${PATH}`, cookie);
  
  return res;
};
