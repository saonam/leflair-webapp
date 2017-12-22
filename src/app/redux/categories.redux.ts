import { SaleProps, getCategorySales as getSales } from '../api/home';
import { CategoryProps } from '../api/categories';
import { INIT_DATA } from './user.redux';

/* TYPES */

export const GET_CATEGORY_SALES = 'categories/GET_CATEGORY_SALES';


/* ACTIONS */

export const getCategorySales = (category: string, store?: any) => {
  return async (dispatch: Function) => {
    const sales: SaleProps[] = await getSales(category, store);

    dispatch({
      type: GET_CATEGORY_SALES,
      category,
      sales
    });
  }
}

/* REDUCER */

export const categoriesReducer = (state: {[key: string]: CategoryProps} = {}, action: { type: string, categories?: CategoryProps[], category?: string, sales?: SaleProps[] }) => {
  switch(action.type) {
    case INIT_DATA:
      return action.categories.reduce((result: any, category: CategoryProps) => {
        result[category.id] = {
          ...category,
          sales: []
        };
        return result;
      }, {});

    case GET_CATEGORY_SALES:
      return {
        ...state,
        [action.category]: {
          ...state[action.category],
          sales: [...action.sales]
        }
      };

    default:
      return state;
  };
};


/* SELECTORS */

export const getCategories = (state: any) => Object.values(state.categories);
export const isCategorySalesAvailable = (state: any) => (category: string) => state.categories[category] && state.categories[category].sales.length;
export const getCategorySalesData = (state: any) => (category: string) => state.categories[category] ? state.categories[category].sales : [];
