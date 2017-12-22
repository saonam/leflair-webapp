import { $post } from './api';


/* constants */
const PATH = 'wishlist';


/* api calls */
export const addToWishlist = async (productId: string) => {
  const res = await $post(`${PATH}`, JSON.stringify({
    productId
  }));

  return res;
};
