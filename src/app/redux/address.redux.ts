import { AddressProps, getAddresses as apiGetAddresses } from '../api/addresses';
import { INIT_DATA, SIGN_OUT } from './user.redux';


/* TYPES */
import { SIGN_IN_GUEST } from './user.redux';
const LOAD_ADDRESSES = 'address/LOAD_ADDRESSES';
const CREATE_ADDRESS = 'address/CREATE_ADDRESS';
const UPDATE_ADDRESS = 'address/UPDATE_ADDRESS';

const initialState= {};

/* ACTIONS */
export const loadAddresses = (isSignedIn: boolean = false) => {
    return async (dispatch: Function) => {
        let shipping;
        let billing;
        if (!isSignedIn) {
            shipping = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('leflair_shipping_address') || null) : null;
            billing = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('leflair_billing_address') || null) : null;
        } else {
            const address = await apiGetAddresses();
            shipping = address.shipping[0];
            billing = address.billing[0];
        }

        dispatch({
            type: LOAD_ADDRESSES,
            shipping,
            billing
        });
    }
};

export const createAddress = (type: string, address: any, duplicateBilling: boolean) => {
    return {
        type: CREATE_ADDRESS,
        addressType: type,
        address,
        duplicateBilling
    };
};

export const updateAddress = (type: string, address: any, duplicateBilling: boolean) => {
    return {
        type: UPDATE_ADDRESS,
        addressType: type,
        address,
        duplicateBilling
    };
};


/* REDUCER */
export const addressReducer = (state: any, action: { type: string, shipping?: any, billing?: any, address?: any, addressType?: string, duplicateBilling?: boolean }) => {
    switch (action.type) {
        case INIT_DATA:
        case LOAD_ADDRESSES: {
          const { shipping, billing } = action;

          return {
            ...state,
            shipping,
            billing
          };
        }

        case CREATE_ADDRESS:
        case UPDATE_ADDRESS:
        case SIGN_IN_GUEST: {
          let shipping;
          let billing;

          try {
            if (!action.addressType || action.addressType === 'shipping') {
              shipping = { ...action.address };

              localStorage.setItem('leflair_shipping_address', JSON.stringify(shipping));
            }

            if (action.duplicateBilling || action.addressType === 'billing') {
              billing = { ...action.address };

              localStorage.setItem('leflair_billing_address', JSON.stringify(billing));
            }
          } catch (e) {};

          return {
            ...state,
            shipping,
            billing
          };
        }

        case SIGN_OUT:
          try {
            localStorage.removeItem('leflair_shipping_address');
            localStorage.removeItem('leflair_billing_address');
          } catch (e) {};
          
          return {
            ...state,
            shipping: null,
            billing: null
          };

        default:
          return state || initialState;
    }
}


/* SELECTORS */
export const getAddresses = (state: any) => state.address ? { shipping: state.address.shipping, billing: state.address.billing } : {};
export const getAddress = (state: any, type: string) => state.address && state.address[type] || null;
