import { $post, $put, $delete } from './api';


/* constants */
const PATH = 'cart-items';


/* props def */
export type CartItemProps = {
  id: string,
  productContentId: string,
  productId: string,
  title: string,
  image: string,
  quantity: number,
  availableQuantity: number,
  retailPrice: number,
  salePrice: number,
  queryParams?: string,
  isMerged?: boolean,
  slug?: string,
  color?: string,
  size?: string,
  message?: string,  // error message when add/update cart item qty
  categories?: string[],
  saleEnded: boolean
};


/* api calls */
export const addCartItem = async (productId: string) => {
  const res = await $post(`${PATH}`, JSON.stringify({
    productId
  }));

  return res;
};

export const updateQuantity = async (id: string, quantity: number) => {
  const res = await $put(`${PATH}/${id}`, JSON.stringify({
    quantity
  }));

  return res;
};

export const removeCartItem = async (id: string) => {
  const res = await $delete(`${PATH}/${id}`);
  
  return res;
};

export const removeCartItems = async (cartItemIds: string[]) => {
  const res = await $put(`${PATH}/delete-multiple`, JSON.stringify({
    cartItemIds
  }));

  return res;
};
