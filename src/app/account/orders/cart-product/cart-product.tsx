import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { Image, Currency } from '../../../common';

import * as styles from './cart-product.scss';

const CartProduct: SFC<{product: any, className?: string, t?: Function}> = (props) => (
  <div className={`${props.className || ''} ${styles.cartProduct}`}>
    <div className={styles.image}>
        <Image style={{width: '100%'}} filename={props.product.image} srcset={[90, 162, 162]} alt=""></Image>
    </div>
    <div className={styles.info}>
        <div className={styles.name}>{props.product.title}</div>
        <div>
            {props.t('orders:QUANTITY')}: {props.product.quantity}
        </div>
        <div>
            {props.t('products:PRICE')}: <Currency amount={props.product.salePrice || 0} />
        </div>
    </div>
  </div>
);

export default translate(['order', 'products'])(CartProduct);