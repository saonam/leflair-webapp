import { history } from '../router';

import { enableSecretSale } from '../api/campaign';

export const secretSaleAction = async (params? :any, cookie?: any, store?: any) => {
  try {
    await enableSecretSale(params.name, store);

    history.push('/sales/secret-sales');
  } catch (error) {
    // campaign not found
    history.push('/');
  }
}