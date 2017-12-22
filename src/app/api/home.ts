import { $get } from './api';
import { addPreviewOffset } from './preview-mode';


/* constants */
const PATH = 'home';


/* props def */
export type SalesProps = {
  featured: SaleProps,
  current: Array<SaleProps>,
  upcoming: Array<UpcomingSaleContentProps>,
  banners: Array<BannerProps>
};

export type SaleProps = {
  id: string,
  title: string,
  endTime: string,
  image: string,
  image2?: string,
  crossBorder?: boolean,
  potd?: boolean,
  product?: {
    id: string,
    name: string
  },
  slug: string,
  categories: Array<string>
};

export type UpcomingSaleContentProps = {
  date?: string,
  sales?: Array<UpcomingSaleProps>
};

export type UpcomingSaleProps = {
  id: string,
  title: string,
  image: string,
  crossBorder?: boolean,
  slug: string
};

export type BannerProps = {
  id?: string;
  image: string;
  url: string;
};


/* api calls */
export const getSales = async (cookie?: any, store?: any) => {
  const res = await $get(addPreviewOffset(PATH, null,store), cookie);
  
  return res;
};

export const getCategorySales = async (category: string, store?: any) => {
  const res = await $get(addPreviewOffset(`${PATH}/${category}`, null, store));
  
  return res;
};
