import * as React from 'react';
import { SFC } from 'react';
import { connect } from 'react-redux';

import { getInvalidItemIds, getCartStatus, toggleCart, getCartItemHasMessage } from '../../redux/cart.redux';
import { toggleNavbar } from '../../layouts/toggler';

import * as styles from './backdrop.scss';

const Backdrop: SFC<{ cartActive: boolean, invalidItemIds: string[], cartItemHasMessage: any, toggleCart: Function, className?: string }> = (props) => (
  <div className={`${styles.bodyBackdrop} ${props.className || ''} ${props.cartActive ? styles.active : ''}`} onClick={() => { props.toggleCart(true, props.invalidItemIds, null, props.cartItemHasMessage); toggleNavbar(true);}}></div>
);

export default connect(
  (state: any) => ({
    cartActive: getCartStatus(state),
    invalidItemIds: getInvalidItemIds(state),
    cartItemHasMessage: getCartItemHasMessage(state)
  }), {
    toggleCart
  }
)(Backdrop);
