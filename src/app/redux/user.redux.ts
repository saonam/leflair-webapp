import { CartItemProps } from '../api/cart';
import { UserProps } from '../api/account';
import { CategoryProps } from '../api/categories';
import * as accountApi from '../api/account';
import * as addressesApi from '../api/addresses';
import * as categoriesApi from '../api/categories';
import * as newsApi from '../api/marketing';

export const DEFAULT_LANG = 'vn';
const callbacks: Function[] = [];
export const registerOnUpdateLangCallback = (cb: Function) => callbacks.push(cb);


/* TYPES */

export const INIT_DATA = 'user/INIT_DATA';
export const SIGN_IN = 'user/SIGN_IN';
export const SIGN_IN_GUEST = 'user/SIGN_IN_GUEST';
export const REGISTER = 'user/REGISTER';
const UPDATE_USER = 'user/UPDATE_USER';
const UPDATE_ACCOUNT_CREDIT = 'user/UPDATE_ACCOUNT_CREDIT';
export const SIGN_OUT = 'user/SIGN_OUT';
const UPDATE_LANG = 'user/UPDATE_LANG';
const SET_LANG = 'user/SET_LANG';
export const SUBSCRIBE = 'user/SUBSCRIBE';
const CLOSE_SUBSCRIPTION = 'user/CLOSE_SUBSCRIPTION';
const UPDATE_EMAIL = 'user/UPDATE_EMAIL';
export const UPDATE_PREVIEW_OFFSET = 'user/UPDATE_PREVIEW_OFFSET';


/* ACTIONS */

export const initData = (cookie?: any) => {
  return async (dispatch: Function) => {
    try {
      const [ { cart, ...user }, categories ] = await Promise.all([
        accountApi.getUser(cookie),
        categoriesApi.getCategories()
      ]);
      const isSubscribed = typeof window !== 'undefined' && localStorage && localStorage.getItem('leflair_subscribed') && JSON.parse(localStorage.getItem('leflair_subscribed')) || false;
      const isSubscriptionClosed = typeof window !== 'undefined' && localStorage && localStorage.getItem('leflair_subscription_closed') && JSON.parse(localStorage.getItem('leflair_subscription_closed')) || false;
      const previewOffset = typeof window !== 'undefined' && localStorage && localStorage.getItem('leflair_preview_offset') && parseInt(localStorage.getItem('leflair_preview_offset')) || undefined;
      // load guest data
      const email = typeof window !== 'undefined' && localStorage && localStorage.getItem('leflair_guest_email') || undefined;
      const shipping = typeof window !== 'undefined' && localStorage && localStorage.getItem('leflair_shipping_address') && JSON.parse(localStorage.getItem('leflair_shipping_address')) || null;
      const billing = typeof window !== 'undefined' && localStorage && localStorage.getItem('leflair_billing_address') && JSON.parse(localStorage.getItem('leflair_billing_address')) || null;

      dispatch({
        type: INIT_DATA,
        user: {
          email,  // guest email
          ...user,// logged in user's email will override guest email above
          isSubscribed,
          isSubscriptionClosed,
          previewOffset,
          isGuest: !user.email
        },
        cart,
        categories,
        shipping,
        billing
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export const initLanguage = (state: any) => {
  const language = state.user.language || (typeof window !== 'undefined' && localStorage && localStorage.getItem('LANGUAGE') || DEFAULT_LANG);
  callbacks.forEach((cb: Function) => cb(language));
  return async (dispatch: Function) => {
    dispatch({
      type: SET_LANG,
      language
    });
  }
}

export const signIn = (email: string, password: string, successCallback?: Function, errorCallback?: Function) => {
  return async (dispatch: Function) => {
    try {
      const { cart, ...user } = await accountApi.signIn(email, password);
      const previewOffset = typeof window !== 'undefined' && localStorage && localStorage.getItem('leflair_preview_offset') && parseInt(localStorage.getItem('leflair_preview_offset')) || undefined;

      dispatch({
        type: SIGN_IN,
        user: {
          ...user,
          previewOffset
        },
        cart
      });

      if (successCallback) {
        successCallback();
      }
    } catch(error) {
      if (errorCallback) {
        errorCallback(error);
      } else {
        console.error(error);
      }
    }
  };
};

export const signInGuest = (data: any) => {
  const {email, firstName, lastName, address, city, district, phone, duplicateBilling, type} = data;
  
  return (dispatch: Function) => {
    const shippingAddress = {
      firstName,
      lastName,
      address,
      city,
      district,
      phone
    };

    dispatch({
      type: SIGN_IN_GUEST,
      email: email,
      address: shippingAddress,
      duplicateBilling
    });
  };
};

export const updateUserEmail = (email: string) => {
  return {
    type: UPDATE_EMAIL,
    email
  }
};


export const register = (data: any, successCallback?: Function, errorCallback?: Function) => {
  const {email, password, gender, language} = data;

  return async (dispatch: Function) => {
    try {
      const { cart, ...user } = await accountApi.register(email, password, gender, language);

      dispatch({
        type: REGISTER,
        user,
        cart: cart || []
      });

      if (successCallback) {
        successCallback();
      }
    } catch(error) {
      if (errorCallback) {
        errorCallback(error);
      } else {
        console.error(error);
      }
    }
  };
};

export const updateUser = (user: UserProps) => ({
  type: UPDATE_USER,
  user
});

export const updateAccountCredit = (accountCredit: number) => ({
  type: UPDATE_ACCOUNT_CREDIT,
  user: {
    accountCredit
  }
});

export const signOut = () => {
  return async (dispatch: Function) => {
    try {
      await accountApi.signOut();

      dispatch({
        type: SIGN_OUT
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export const updateLang = (language: string, isSignedIn?: boolean) => {
  return async (dispatch: Function) => {
    callbacks.forEach((cb: Function) => cb(language));

    try {
      if (isSignedIn) {
        await accountApi.updateLanguage(language);
      }

      dispatch({
        type: UPDATE_LANG,
        language
      });
    } catch(error) {
      console.error(error);
    }
  }
};

export const subscribe = (email: string, context = 'Inline Form') => {
  return async (dispatch: Function) => {
    await newsApi.subscribe(email);

    setTimeout(() => {
      dispatch({
        type: SUBSCRIBE,
        context
      });
    }, 3000);
  }
};

export const closeSubscription = () => {
  return (dispatch: Function) => {
    dispatch({
      type: CLOSE_SUBSCRIPTION
    });
  }
};

export const updatePreviewOffset = (previewOffset: number) => {
  return (dispatch: Function) => {
    dispatch({
      type: UPDATE_PREVIEW_OFFSET,
      previewOffset
    });
  }
};


/* REDUCER */

export const userReducer = (state: any = {}, action: { type: string, user?: UserProps, language?: string, email?: string, previewOffset?: number }) => {
  switch(action.type) {
    case INIT_DATA:
    case UPDATE_USER:
    case UPDATE_ACCOUNT_CREDIT:
      return {
        ...state,
        ...action.user
      };

    case SIGN_IN:
    case REGISTER:
      return {
        ...state,
        ...action.user,
        isGuest: false
      };
    
    case SIGN_IN_GUEST:
      if (action.email) {
        try {
          localStorage.setItem('leflair_guest_email', action.email);
        } catch (e) {}
      }

      return {
        ...state,
        email: action.email,
        isGuest: true
      }

    case SIGN_OUT:
      try {
        localStorage.removeItem('leflair_guest_email');
      } catch (e) {};

      const { language, isSubscribed, isSubscriptionClosed } = state;
      return {
        language,
        isSubscribed,
        isSubscriptionClosed,
        isGuest: true
      };

    case UPDATE_EMAIL:
      return {
        ...state,
        email: action.email
      };

    case UPDATE_LANG:
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        try {
          localStorage.setItem('LANGUAGE', action.language);
        } catch (e) {
          // LocalStorage API failure - it's probably full. No need to handle this.
        }
      }

      return {
        ...state,
        language: action.language
      };

    case SET_LANG:
      return {
        ...state,
        language: action.language
      };

    case SUBSCRIBE:
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        try {
          localStorage.setItem('leflair_subscribed', 'true');
        } catch (e) {
          // LocalStorage API failure - it's probably full. No need to handle this.
        }
      }

      return {
        ...state,
        isSubscribed: true
      };
    
    case CLOSE_SUBSCRIPTION:
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        try {
          localStorage.setItem('leflair_subscription_closed', 'true');
        } catch (e) {
          // LocalStorage API failure - it's probably full. No need to handle this.
        }
      }
      
      return {
        ...state,
        isSubscriptionClosed: true
      }

    case UPDATE_PREVIEW_OFFSET:
      if (typeof window !== 'undefined' && localStorage) {
        localStorage.setItem('leflair_preview_offset', action.previewOffset.toString());
      }
      
      return {
        ...state,
        previewOffset: action.previewOffset
      };

    default:
      return state;
  };
};


/* SELECTORS */

export const isSignedIn = (state: any): boolean => state.user && !state.user.isGuest && !!state.user.email;

export const isGuest = (state: any): boolean => state.user && state.user.isGuest;

export const getEmail = (state: any) => state.user && state.user.email;

export const readyForCheckout = (state: any): boolean => isSignedIn(state) || !!getEmail(state);

export const getUser = (state: any) => state.user;

export const getCurrentLang = (state: any) => state.user.language;

export const getAccountCredit = (state: any) => state.user.accountCredit || 0;

export const isAllowedPreview = (state: any) => state.user && state.user.preview;

export const getPreviewOffset = (state: any) => state.user && state.user.preview && state.user.previewOffset || 0;

export const isSubscribed = (state: any) => state.user && state.user.isSubscribed;

export const isSubscriptionClosed = (state: any) => state.user && state.user.isSubscriptionClosed;

export const isWelcomeMessage = (state: any) => state.user.isWelcomeMessage;

export const welcomeMessageText = (state: any) => state.user.welcomeMessageText;
