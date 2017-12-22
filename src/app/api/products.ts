import { $get } from './api';
import { addPreviewOffset } from './preview-mode';


/* constants */
const PATH = 'product';


/* props def */
export type ProductContentProps = {
  id: string,
  sale?: {
      id: string,
      title: string,
      startTime: Date,
      endTime: Date
  },
  brand: BrandProps,
  title: string,
  returnable: boolean,
  returnDays: number,
  description: DescriptionProps,
  images: object,
  sizeChart?: SizeChartItemProps[],
  colors: ColorProps[],
  sizes: SizeProps[],
  products: ProductProps[]
};

export type ProductProps = {
  id: string,
  size: string,
  color: string,
  retailPrice: number,
  salePrice: number,
  saleId: string,
  inStock: boolean,
  imageKey: string,
  quantity: number,
  numberOfVariations: number
};

export type ColorProps = {
  name: string,
  hex?: string,
  hex2?: string,
  soldOut: boolean,
  availableSizes: string[]
};

export type SizeProps = {
  name: string,
  soldOut: boolean,
  availableColors: string[]
};

export type BrandProps = {
  name: string,
  description: string,
  logo: string;
};

export type DescriptionProps = {
  heading: string,
  secondary: {
    header: string,
    data: string[]
  }[],
  materialCare?: {
    header: string,
    data: string[]
  }[],
  sizeFit?: {
    header: string,
    data: string[]
  }[]
};

export type SizeChartItemProps = {
  name: string,
  values: string[]
};

/* api calls */

export const getProductContent = async (id: string, store?: any) => {
  const res = await $get(addPreviewOffset(`${PATH}/${id}`, null, store));
  
  return res;
};

export const viewProduct = async (id: string, variation: string) => {
  const res = await $get(`${PATH}/view-product/${id}/${variation}`);
  
  return res;
};
