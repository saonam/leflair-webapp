import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Currency } from '../../../common';
import { PaymentMethod, IPaymentMethod } from '../payment-method';

import * as styles from './cod.scss';

export const SHIPPING_FEE = 25000;

class COD extends PaymentMethod<IPaymentMethod, {}> {
  method = 'COD';
  shipping = SHIPPING_FEE;

  render() {
    return this.isValid() && (
      <div className={`${this.props.className || ''} ${this.isSelected() ? styles.active : ''} ${styles.option}`} onClick={this.select}>
        <div className={`${styles.heading} clearfix`}>
          <label className={`${styles.customControl} ${styles.customRadio}`}>
            <input
              id="input-cod"
              name="radio"
              type="radio"
              className={styles.customControlInput}
              checked={this.isSelected()}
              readOnly />
    
            <span className={styles.customControlIndicator}></span>
            <span className={styles.customControlDescription}>{this.props.t('orders:CASH_ON_DELIVERY')}</span>
          </label>
    
          <span className={`${styles.shippingFee} ${this.props.voucher && this.props.voucher.freeShipping && styles.freeShipping || ''}`}>
            {this.props.voucher && this.props.voucher.freeShipping && this.props.t('orders:FREE_SHIPPING') || <Currency amount={SHIPPING_FEE}/>}
          </span>
        </div>
      </div>
    );
  }
}

export default translate('orders')(COD);
