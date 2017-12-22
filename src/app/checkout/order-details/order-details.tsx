import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { Currency } from '../../common';
import { getInvalidItemIds, getCartStatus, toggleCart } from '../../redux/cart.redux';

import { CartItemProps } from '../../api/cart';

import * as styles from './order-details.scss';

type OrderDetailsProps = {
    cart: CartItemProps[],
    cartActive: boolean,
    disabledEdit: boolean,
    invalidItemIds: string[],
    toggleCart: Function,
    className?: string,
    t?: Function,
};

const OrderDetailsComponent: SFC<OrderDetailsProps> = (props) => (
  <div className={styles.card}>
    <div className={styles.cardBlock}>
        <h4 className={styles.cardTitle}>
            <span>{props.t('orders:YOUR_ORDERS')} ({props.cart.length} {props.t('ITEMS')})</span>
            {!props.disabledEdit && <div className={styles.actions}>
                    <a href="javascript:void(0)" onClick={() => props.toggleCart(props.cartActive, props.invalidItemIds, props.cart)}>{props.t('EDIT')}</a>
            </div>}
        </h4>

        <div>
            {props.cart.map((cartItem: CartItemProps, index: number) => (
              <div key={index} className={`${styles.product} clearfix`}>
                  <div className={styles.image}>
                      <img src={cartItem.image} />
                  </div>
                  <div className={styles.info}>
                      {cartItem.categories && cartItem.categories.indexOf('International') !== -1 && <div className={styles.label}>{props.t('common:INTERNATIONAL')}</div>}
                      <div className={styles.title}>{cartItem.title}</div>
                      <div className={styles.desc}>{props.t('orders:QTY')}: {cartItem.quantity}</div>
                      <div className={styles.desc}>{props.t('products:PRICE')}: <Currency amount={cartItem.salePrice}/></div>
                  </div>
              </div>
            ))}
        </div>
    </div>
  </div>
);

const connectedOrderDetails = connect(
    (state: any) => ({
        invalidItemIds: getInvalidItemIds(state),
        cartActive: getCartStatus(state)
    }), {
        toggleCart
    }
)(OrderDetailsComponent);

export default translate(['common', 'products', 'orders'])(connectedOrderDetails) as any;
