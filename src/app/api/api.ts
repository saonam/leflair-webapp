import * as fetch from 'isomorphic-fetch';

const HOST = typeof window !== 'undefined' ? '' : process.env.WWW_API_SERVICE_HOST ? `http://${process.env.WWW_API_SERVICE_HOST}` : 'http://localhost:8000';

export const BASE_URL = `${HOST}/api/v2`;

const onStart: Array<Function> = [];
const onError: Array<Function> = [];
const onSuccess: Array<Function> = [];

export const request: any = async function(uri: string, method: string, body?: any, cookie?: any) {
  // Check to avoid saving loadingBar state on serverside rendering
  onStart.forEach(fn => fn(uri));

  const res = await fetch(`${BASE_URL}/${uri}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      cookie
    },
    body
  });
  const json = await res.json();
  
  if (!res.ok) {
    onError.forEach(fn => fn(json));
    throw json;
  }
  onSuccess.forEach(fn => fn(json));
  return json;
};

request.onStart = (callback: Function) => onStart.push(callback);
request.onError = (callback: Function) => onError.push(callback);
request.onSuccess = (callback: Function) => onSuccess.push(callback);

export const $get = async (uri: string, cookie?: any) => request(uri, 'GET', null, cookie);
export const $post = async (uri: string, body?: any) => request(uri, 'POST', body);
export const $put = async (uri: string, body?: any) => request(uri, 'PUT', body);
export const $delete = async (uri: string, body?: any) => request(uri, 'DELETE', body);
