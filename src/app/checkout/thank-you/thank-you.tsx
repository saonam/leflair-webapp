import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { history } from '../../router';
import { CheckoutLayout } from '../../layouts';
import { Container, Row, Link } from '../../common';
import { Recommendations } from '../../product/recommendations';
import { AddPasswordForm } from '../add-password-form';
import { SingleOrder } from './single-order';
import { MultipleOrders } from './multiple-orders';

import { isGuest, isSignedIn, updateUser } from '../../redux/user.redux';

import { OrderProps, getOrder } from '../../api/orders';
import { getBestSellers } from '../../api/best-sellers';
import * as GoogleAnalytics from '../../api/google-analytics';
import * as FacebookPixel from '../../api/facebook-pixel';
import * as Criteo from '../../api/criteo';
import * as Ants from '../../api/ants';
import * as AccessTrade from '../../api/access-trade';
import * as MasOffer from '../../api/masoffer';
import { CaptureOrder } from '../../api/rtb-house';
import { GoogleConversionTracking } from '../../api/google-tracking';

import * as styles from './thank-you.scss';

const mergeOrders = (code: string, orders: OrderProps[]) => {
  const mergedOrder: any = {
    code,
    products: [],
    paymentSummary: {
      total: 0,
      shipping: 0
    },
    isFirstOrder: false
  };
  orders.forEach((o: OrderProps) => {
    mergedOrder.isFirstOrder = o.isFirstOrder || mergedOrder.isFirstOrder;
    mergedOrder.paymentSummary.total += o.paymentSummary.total;
    mergedOrder.paymentSummary.shipping += o.paymentSummary.shipping;
    mergedOrder.products = mergedOrder.products.concat(o.products);
  });

  return mergedOrder;
}

export const thankYouAction = async (params: any, cookie: any, store: any) => {
  const [ order, bestSellers ] = await Promise.all([
    getOrder(params.code, cookie),
    []
  ]);

  // integrations
  const mergedOrder = Array.isArray(order) ? mergeOrders(params.code, order) : order;
  GoogleAnalytics.captureOrder(mergedOrder);
  FacebookPixel.captureOrder(mergedOrder);
  Criteo.captureOrder(mergedOrder);
  Ants.captureOrder(mergedOrder);
  AccessTrade.captureOrder(mergedOrder);
  MasOffer.captureOrder(store, mergedOrder);

  return {
    component: (
      <ThankYou bestSellers={bestSellers}>
        { Array.isArray(order) ? <MultipleOrders orders={order} /> : <SingleOrder order={order} /> }

        <CaptureOrder order={mergedOrder} />
        <GoogleConversionTracking order={mergedOrder} />
      </ThankYou>
    )
  };
};

type ThankYouProps = {
  bestSellers: any[],
  children?: any,
  t?: Function,
  // redux
  isGuest: boolean,
  updateUser: Function
};

class ThankYouComponent extends Component<ThankYouProps, {}> {
  constructor(props: ThankYouProps) {
    super(props);

    this.createAccount = this.createAccount.bind(this);
  }

  createAccount(user: any) {
    this.props.updateUser(user);
    history.push('/');
  }

  render() {
    return (
      <CheckoutLayout className={styles.footerPaddingReset}>
        <Container>
          {this.props.children}

          {this.props.isGuest && <div className={styles.createAccount}>
              <Row>
                  <div className={`${styles.col} ${styles.colLg5}`}>
                      <div className={styles.card}>
                          <div className={styles.cardBlock}>
                              <h3 className={styles.cardTitle}>{this.props.t('account:CREATE_AN_ACCOUNT_AND_ENJOY')}</h3>
                              <div className={styles.cardText}>
                                  <div>1. {this.props.t('ORDER_STATUS_TRACKING')}</div>
                                  <div>2. {this.props.t('SIMPLE_CHECKOUT_FOR_FUTURE_ORDERS')}</div>
                                  <div className={styles.createAccountForm}>
                                      <AddPasswordForm onSubmit={this.createAccount} />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </Row>
          </div>}
        </Container>

        <Container className={styles.removePadding}>
          <div className={styles.youMayLike}>
              <Recommendations products={this.props.bestSellers} />

              <div className={styles.continueShopping}>
                  <Link path="/">
                      <i className="fa fa-chevron-left fa-fw" />
                      {this.props.t('CONTINUE_SHOPPING')}
                  </Link>
              </div>
          </div>
        </Container>
      </CheckoutLayout>
    );
  }
}

const ThankYou = connect(
(state) => ({
  isGuest: isGuest(state)
}), {
  updateUser
})(translate(['common', 'checkout', 'account'])(ThankYouComponent)) as any;
