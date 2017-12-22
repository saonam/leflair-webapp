import * as qs from 'qs';

import { isAllowedPreview, getPreviewOffset } from '../redux/user.redux';

export const addPreviewOffset = (path: string, queryParams = {}, store: any) => {
  const state = store.getState();
  const search = qs.stringify({
    ...queryParams,
    previewOffset: isAllowedPreview(state) && getPreviewOffset(state) || undefined
  }, {
    filter: (k: string, v: string | string[]) => Array.isArray(v) ? v.join(',') : v,
    encode: false
  });
  
  return `${path}${search ? `?${search}` : ''}`;
};
