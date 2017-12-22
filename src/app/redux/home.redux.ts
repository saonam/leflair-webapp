import { getSales } from '../api/home';
import { getBestSellers } from '../api/best-sellers';
import { SalesProps } from '../api/home';
import { checkSecretSale } from '../api/campaign';

/* TYPES */

export const GET_HOME = 'home/GET_HOME';
export const CHECK_SECRET_SALE = 'home/CHECK_SECRET_SALE';


/* ACTIONS */

export const getHome = (cookie?: any, store?: any) => {
  return async (dispatch: Function) => {
    const [sales, bestSellers] = await Promise.all([ getSales(cookie, store), getBestSellers(cookie) ]);

    dispatch({
      type: GET_HOME,
      sales,
      bestSellers
    });
  }
}

export const checkSecretSaleStatus = (store?: any) => {
  return async (dispatch: Function) => {
    const isAvailable = await checkSecretSale(store);

    dispatch({
      type: CHECK_SECRET_SALE,
      isAvailable
    });
  }
}


/* REDUCER */

export const homeReducer = (state: any = { sales: {}, bestSellers: [] }, action: { type: string, sales?: SalesProps, bestSellers?: any, isAvailable?: boolean }) => {
  switch(action.type) {
    case GET_HOME:
      return {
        ...state,
        sales: action.sales,
        bestSellers: action.bestSellers,
      }
    case CHECK_SECRET_SALE: 
      return {
        ...state,
        secretSale: action.isAvailable
      }  
    default:
      return state;    
  }
}


/* SELECTORS */
export const isHomeAvailable = (state: any) => state.home && state.home.sales && Object.keys(state.home.sales).length && state.home.bestSellers && state.home.bestSellers.length;

export const getHomeSales = (state: any) => {
  if (!(state.home && state.home.sales)) {
    return {};
  }

  if (!(state.home.sales.banners && state.home.sales.banners.length)) {
    return state.home.sales;
  }

  // Clone the "current" array so that we don't mutate state
  const current = state.home.sales.current.slice(0);

  // Splice in our banner objects
  // current.splice(4, 0, state.home.sales.banners);

  // Create a fresh object to return so that we don't mutate state
  return Object.assign({}, state.home.sales, {
    current
  });
};

export const getHomeBestSellers = (state: any) => state.home ? state.home.bestSellers : [];
export const getSecretSaleStatus = (state: any) => state.home && state.home.secretSale;
