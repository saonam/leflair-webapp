import { $get } from './api';


/* constants */
const PATH = 'categories';


/* props def */
export type CategoryProps = {
  id: string,
  title: string
};


/* api calls */
export const getCategories = async () => {
  const res = await $get(`${PATH}`);
  
  return res;
};
