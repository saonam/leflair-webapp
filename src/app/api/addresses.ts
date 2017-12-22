import { $get, $post, $put, $delete } from './api';


/* constants */
const PATH = 'addresses';


/* props definition */
export type AddressesProps = {
  shipping?: AddressProps[],
  billing?: AddressProps[]
};

export type AddressProps = {
  id?: string,
  firstName: string,
  lastName: string,
  address: string,
  phone: string,
  district: DistrictProps,
  city: CityProps,
  companyName?: string,
  taxCode?: string,
  default?: boolean,
  note?: string
};

export type DistrictProps = {
  id: string,
  name: string
};

export type CityProps = {
  id: string,
  name: string
};


/* api calls */
export const getAddresses = async (cookie?: any) => {
  const res = await $get(`${PATH}`, cookie);
  
  return res;
};

export const getAddress = async (id: string, cookie?: any) => {
  const res = await $get(`${PATH}/${id}`, cookie);
  
  return res;
};

export const createAddress = async (type: string, address: AddressProps, duplicateBilling: boolean = false) => {
  const res = await $post(`${PATH}`, JSON.stringify({
    ...address,
    default: true,
    type,
    duplicateBilling
  }));

  return res;
};

export const updateAddress = async (type: string, address: AddressProps, duplicateBilling: boolean = false) => {
  const res = await $put(`${PATH}/${address.id}`, JSON.stringify({
    ...address,
    type,
    duplicateBilling
  }));

  return res;
};

export const setDefault = async (address: AddressProps) => {
  const res = await $put(`${PATH}/${address.id}`, JSON.stringify({
    ...address,
    default: true
  }));

  return res;
};

export const deleteAddress = async (id: string) => {
  const res = await $delete(`${PATH}/${id}`);
  
  return res;
};

export const getCities = async () => {
  try {
    const res = await $get(`${PATH}/cities`);

    return res;
  } catch(error) {
    throw error;
  }
};

export const getDistricts = async (cityId: string) => {
  try {
    const res = await $get(`${PATH}/cities/${cityId}/districts`);

    return res;
  } catch(error) {
    throw error;
  }
};
