import { $post } from './api';


/* constants */
const PATH = 'news';


/* api calls */
export const subscribe = async (email: string) => {
  const res = await $post(`${PATH}/subscribe`, JSON.stringify({
    email
  }));

  return res;
};
