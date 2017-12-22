import { $get } from './api';


/* constants */
const PATH = 'product-recommendations';


/* api calls */
export const getRecommendations = async (productContentId: string) => {
  const res = await $get(`${PATH}/${productContentId}`);
  
  return res;
};
