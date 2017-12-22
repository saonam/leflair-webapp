import * as React from 'react';
import { SFC } from 'react';
import { connect } from 'react-redux';

import { Button } from '../../../common';

import { getInvalidItemIds, getCartStatus, toggleCart } from '../../../redux/cart.redux';

import * as styles from './cart-button.scss';

const CartButton: SFC<{cartSize: number, className?: string, invalidItemIds: string[], cartActive: boolean, toggleCart: Function}> = (props) => (
  <Button className={`${props.className} ${styles.btnCart}`} type="button" onClick={() => props.toggleCart(props.cartActive, props.invalidItemIds)}>
    <i className={`ic-ic-bag ${styles.icon}`}>
      {props.cartSize ?
      (<span className={styles.badge}>{props.cartSize}</span>) :('')
      }
        
    </i>
  </Button>
);

export default connect(
  (state: any) => ({
    invalidItemIds: getInvalidItemIds(state),
    cartActive: getCartStatus(state)
  }), {
    toggleCart
  }
)(CartButton) as any;
