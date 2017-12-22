import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Row } from '../../../common';
import { PaymentMethod, CheckoutResponse, IPaymentMethod } from '../payment-method';
import { getTransaction } from '../transaction';

import * as styles from './atm.scss';

interface IATMMethod extends IPaymentMethod {
  language: string;
}

class ATM extends PaymentMethod<IATMMethod, {}> {
  method = 'ATM';
  shipping = 0;

  async submit() {
    const { language, code, email, address, cart, billingItems, voucher }: IATMMethod = this.props;

    await this.checkout({
      language,
      code,
      email,
      address,
      cart: this.resolveCart(cart),
      shipping: this.shipping,
      accountCredit: billingItems.usedCredit,
      voucher: this.resolveVoucher(voucher),
      method: this.method
    }, (res: CheckoutResponse) => {
      getTransaction(this.method)
        .addCode(res.code)
        .addServerData(res.data)
        .processPayment();
    });
  }

  render() {
    return this.isValid() && (
      <div className={`${styles.option} ${this.isSelected() ? styles.active : ''}`} onClick={this.select}>
        <div className={`${styles.heading} clearfix`}>
          <label className={`${styles.customControl} ${styles.customRadio}`}>
            <input
              id="input-credit-card"
              name="radio"
              type="radio"
              className={styles.customControlInput}
              checked={this.isSelected()}
              readOnly />
            <span className={styles.customControlIndicator}></span>
            <span className={styles.customControlDescription}>{this.props.t('orders:PAY_WITH_ATM')}</span>
          </label>      
    
          <div className={`${styles.shippingFee} ${styles.freeShipping}`}>
            {this.props.t('orders:FREE_SHIPPING')}
          </div>
        </div>
      </div>
    );
  }
}

export default translate('orders')(ATM);
