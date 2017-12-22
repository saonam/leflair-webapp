import { $get } from './api';
import { addPreviewOffset } from './preview-mode';


/* constants */
const PATH = 'upcoming-sale';


/* api calls */
export const getUpcomingSale = async (id: string, store?: any) => {
  const res = await $get(addPreviewOffset(`${PATH}/${id}`, null, store));
  
  return res;
};
