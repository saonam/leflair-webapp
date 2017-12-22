import * as fetch from 'isomorphic-fetch';

export const check = async (version: string) => {
  const res = await fetch(`/version/${version}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (!res.ok) {
    throw 'Failed to check version';
  }

  const json = await res.json();

  return json;
};
