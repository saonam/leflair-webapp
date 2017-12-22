import * as qs from 'qs';

import { $get } from './api';
import { addPreviewOffset } from './preview-mode';
import { quantity } from '../layouts/cart/cart.scss';


/* constants */
const PATH = 'sales';


/* props definition */
export type SaleProps = {
  id: string,
  title: string,
  endTime: Date,
  products: ProductProps[],
  filter: FilterProps,
  sort: string[],
  image: string,
  potd: boolean
};

export type ProductProps = {
  id: string,
  title: string,
  image: string,
  image2: string,
  retailPrice: number,
  salePrice: number,
  soldOut: boolean,
  gender?: string,
  category?: string,
  color?: string,
  size?: string,
  brand: string,
  slug: string,
  queryParams?: string,
  quantity: number,
  numberOfVariations: number
};

export type FilterProps = {
  gender?: Array<FilterOptionProps>,
  category?: Array<FilterOptionProps>,
  color?: Array<FilterOptionProps>,
  size?: Array<FilterOptionProps>,
  brand: Array<FilterOptionProps>,
  [key: string]: Array<FilterOptionProps>
};

export type FilterOptionProps = {
  display: string,
  value: string
};


/* api calls */
export const getSale = async (id: string, filter?: any, sort?: string, store?: any) => {
  const queryParams = {
    ...(filter || {}),
    sort
  };
  const res = await $get(addPreviewOffset(`${PATH}/${id}`, queryParams, store));
  
  return res;
};
