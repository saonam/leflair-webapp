import * as React from 'react';
import { SFC } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { history } from '../router';
import { DefaultLayout } from '../layouts';
import { Container, Grid, Row, Image, Link, Button } from '../common';
import { EndTime } from '../sale/end-time';

import { SaleCard } from '../home';
import { FirstSaleTile } from './first-sale-tile';

import { SaleProps } from '../api/home';
import { TrackCategory } from '../api/rtb-house';

import { getCategorySales, isCategorySalesAvailable, getCategorySalesData } from '../redux/categories.redux';
import { InternationalLayout } from '../category-layouts/international';
import { DefaultCategoryLayout } from '../category-layouts/default';


export const categoryAction = async (params: { category: string }, cookie: any, store: any) => {
  try {
    if (typeof window === 'undefined' || !isCategorySalesAvailable(store.getState())(params.category)) {
      await store.dispatch(getCategorySales(params.category, store));
    } else {
      store.dispatch(getCategorySales(params.category, store));
    }

    const customLayouts: {[key: string]: any} = {
      International: InternationalLayout
    }

    const Layout = customLayouts[params.category] || DefaultCategoryLayout;

    const ConnectedLayout = connect(
      (state) => ({
        sales: getCategorySalesData(state)(params.category)
      })
    )(Layout) as any;

    return {
      component: <ConnectedLayout category={params.category} />
    };
  } catch(error) {
    // category not found handler
    history.replace('/');

    return;
  }
};
