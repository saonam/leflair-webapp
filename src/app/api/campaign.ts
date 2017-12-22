import { $get } from './api';
import { addPreviewOffset } from './preview-mode';

/* api calls */
export const enableSecretSale = async (name: string, store?: any) => {
    const enable = await $get(addPreviewOffset(`campaigns/${name}`, null, store));

    return enable;
}

export const getSecretSales = async (store?: any) => {
    return await $get(addPreviewOffset('secret-sales', null, store));
}

export const checkSecretSale = async (store?: any) => {
    return await $get(addPreviewOffset('secret-sales/check', null, store));
}
