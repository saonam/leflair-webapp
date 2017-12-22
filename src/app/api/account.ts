import { BASE_URL, $get, $put, $post } from './api';


/* constants */
const PATH = 'account';

export const signInByFacebookUrl = `${BASE_URL}/${PATH}/facebook`;


/* props def */
export type PersonalInfoProps = {
  firstName: string,
  lastName: string,
  email: string
};

export type UserProps = {
  id?: string,
  firstName?: string,
  lastName?: string,
  email: string,
  provider?: string,
  language: string,
  accountCredit: number,
  state: string,
  preview?: boolean,
  previewOffset?: number
};


/* api calls */
export const getUser = async (cookie?: any) => {
  const res = await $get(`${PATH}`, cookie);
  
  return res;
};

export const updatePersonalInfo = async (firstName: string, lastName: string, email: string) => {
  const res = await $put(`${PATH}`, JSON.stringify({
    firstName,
    lastName,
    email
  }));

  return res;
};

export const updateLanguage = async (language: string) => {
  const res = await $put(`${PATH}`, JSON.stringify({
    language
  }));

  return res;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const res = await $put(`${PATH}/password`, JSON.stringify({
    currentPassword,
    newPassword
  }));

  return res;
};

export const addPassword = async (password: string) => {
  const res = await $post(`${PATH}/add-password`, JSON.stringify({
    password
  }));

  return res;
};

export const signIn = async (email: string, password: string) => {
  const res = await $post(`${PATH}/signin`, JSON.stringify({
    email,
    password
  }));

  return res;
};

export const signOut = async () => {
  const res = await $get(`${PATH}/signout`);
  
  return res;
};

export const register = async (email: string, password: string, gender: string, language: string) => {
  const res = await $post(`${PATH}/signup`, JSON.stringify({
    email,
    password,
    gender,
    language
  }));

  return res;
};

export const createGuestAccount = async (email: string, firstName: string, lastName: string, language: string) => {
  const res = await $post(`${PATH}/guest`, JSON.stringify({
    email,
    firstName,
    lastName,
    language
  }));

  return res;
};

export const forgotPassword = async (email: string) => {
  const res = await $post(`${PATH}/forgot`, JSON.stringify({
    email
  }));

  return res;
};

export const resetPassword = async (password: string, token: string) => {
  const res = await $post(`${PATH}/reset`, JSON.stringify({
    password,
    token
  }));

  return res;
};

export const verifyEmail = async (email: string) => {
  const res = await $get(`${PATH}/email-exists?email=${email}`);
  
  return res;
};
