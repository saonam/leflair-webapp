import { INIT_DATA, SIGN_IN, REGISTER, SIGN_OUT } from './user.redux';
import { CartItemProps } from '../api/cart';
import * as cartApi from '../api/cart';
import * as Criteo from '../api/criteo';
import * as Ants from '../api/ants';

/* TYPES */

const UPDATE_CART = 'cart/UPDATE_CART';
export const ADD_CART_ITEM = 'cart/ADD_CART_ITEM';
const UPDATE_CART_ITEM_QTY = 'cart/UPDATE_CART_ITEM_QTY';
const REMOVE_CART_ITEM = 'cart/REMOVE_CART_ITEM';
const REMOVE_CART_ITEMS = 'cart/REMOVE_CART_ITEMS';
const CLEAR_CART_ITEM_MESSAGE = 'cart/CLEAR_CART_ITEM_MESSAGE';
const SET_CART_ACTIVE = 'cart/SET_CART_ACTIVE';
const CLOSE_CART = 'cart/CLOSE_CART';

/* ACTIONS */

export const updateCart = (cart: CartItemProps[]) => ({
  type: UPDATE_CART,
  cart
});

export const addCartItem = (productId: string, color: any) => {
  return async (dispatch: Function) => {
    try {
      const cartItem = await cartApi.addCartItem(productId);

      dispatch({
        type: ADD_CART_ITEM,
        cartItem,
        color
      });
    } catch(error) {
      if (error.code !== 403) {
        throw error;
      }

      dispatch({
        type: ADD_CART_ITEM,
        cartItem: error.data,
        message: error.message
      });
    }
  };
}

export const updateCartItemQty = (cartItemId: string, quantity: number) => {
  return async (dispatch: Function) => {
    try {
      const cartItem = await cartApi.updateQuantity(cartItemId, quantity);

      dispatch({
        type: UPDATE_CART_ITEM_QTY,
        cartItem
      });
    } catch(error) {
      if (error.code !== 403) {
        throw error;
      }

      dispatch({
        type: UPDATE_CART_ITEM_QTY,
        cartItem: error.data,
        message: error.message
      });
    }
  };
};

export const removeCartItem = (cartItemId: string) => {
  return async (dispatch: Function) => {
    try {
      await cartApi.removeCartItem(cartItemId);

      dispatch({
        type: REMOVE_CART_ITEM,
        cartItemId
      });
    } catch(error) {
      console.error(error);
    }
  };
};

export const removeCartItems = (cartItemIds: string[]) => {
  return async (dispatch: Function) => {
    cartApi.removeCartItems(cartItemIds);

    dispatch({
      type: REMOVE_CART_ITEMS,
      cartItemIds
      });
  }
};

export const clearCartItemMessage = (cartItemId: string) => ({
  type: CLEAR_CART_ITEM_MESSAGE,
  cartItemId
});

export const toggleCart = (active: boolean, itemIds: Array<string>, cartItems?: CartItemProps[], cartItemHassMessage?: CartItemProps) => {
  return async (dispatch: Function) => {
    if (active) {
      if (itemIds.length) {
        await cartApi.removeCartItems(itemIds); // Invalid items

        dispatch({
          type: REMOVE_CART_ITEMS,
          cartItemIds: itemIds
        });
      }

      if (cartItemHassMessage) {
        dispatch({
          type: CLEAR_CART_ITEM_MESSAGE,
          cartItemId: cartItemHassMessage.id
        })
      }
    } else if (cartItems) {
      Criteo.viewCart(cartItems);
      Ants.viewCart(cartItems);
    }

    dispatch({
      type: SET_CART_ACTIVE,
      active: !active
    });
  }
};

export const closeCart = () => {
  return async (dispatch: Function) => {
    dispatch({
      type: CLOSE_CART
    })
  }
}

/* REDUCER */

export const cartReducer = (state: { [key: string]: CartItemProps } = {}, action: { type: string, cart?: CartItemProps[], cartItem?: CartItemProps, cartItemId?: string, cartItemIds?: string[], message?: string, active: boolean}) => {
  switch(action.type) {
    /* actions from user.redux.ts */
    case INIT_DATA:
    case SIGN_IN:
    case REGISTER:
    case UPDATE_CART:
    return action.cart.reduce((result: any, cartItem: CartItemProps) => {
      result[cartItem.id] = {...cartItem};
        return result;
      }, {});

    case SIGN_OUT:
      return {};
    /* actions from user.redux.ts */

    case ADD_CART_ITEM:
    case UPDATE_CART_ITEM_QTY:
      return {
        ...state,
        [action.cartItem.id]: {
          ...action.cartItem,
          message: action.message
        },
      };

    case REMOVE_CART_ITEM:
      const { [action.cartItemId]: CartItemProps, ...rest } = state;
      return { ...rest };

    case REMOVE_CART_ITEMS:
      return action.cartItemIds.reduce((cart: {[key: string]: CartItemProps}, cartItemId: string) => {
        const { [cartItemId]: CartItemProps, ...rest } = cart;
        return { ...rest };
      }, state);
      

    case CLEAR_CART_ITEM_MESSAGE:
      return {
        ...state,
        [action.cartItemId]: {
          ...state[action.cartItemId],
          message: undefined
        }
      }
    case SET_CART_ACTIVE:   
      return {
        ...state,
        active: action.active
      }
    case CLOSE_CART:
      return {
        ...state,
        active: false
      }  

    default:
      return state;
  };
};


/* SELECTORS */

export const getCart = (state: any) => Object.values(state.cart).filter(cartItem => typeof cartItem !== 'boolean');

export const getCartSize = (state: any) => Object.values(state.cart).reduce((acc: number, cartItem: CartItemProps) => typeof cartItem !== 'boolean' ? acc + cartItem.quantity : acc, 0);

export const getCartItemHasMessage = (state: any) => Object.values(state.cart).find((cartItem: CartItemProps) => !!cartItem.message);

export const getInvalidItemIds = (state: any) => {
  const removedIds: Array<string> = [];
  const cartItems = state.cart;

  Object.keys(cartItems).forEach((key: string) => {
    if (cartItems[key].availableQuantity < 1 ||cartItems[key].saleEnded ) {
      removedIds.push(key);
    }
  })

  return removedIds;
}

export const getCartStatus = (state: any) => state.cart.active;