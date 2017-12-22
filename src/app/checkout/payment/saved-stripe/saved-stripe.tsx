import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Row } from '../../../common';
import { history } from '../../../router';
import { CreditCardProps } from '../../../api/credit-cards';
import { PaymentMethod, CheckoutResponse, IPaymentMethod } from '../payment-method';
import { getTransaction } from '../transaction';

import * as styles from './saved-stripe.scss';

interface ISavedStripeMethod extends IPaymentMethod {
  creditCard: CreditCardProps;
}

class SavedStripe extends PaymentMethod<ISavedStripeMethod, {}> {
  method = 'STRIPE';
  value = this.props.creditCard.id;
  shipping = 0;
  isCC = true;

  isValid() {
    return this.props.billingItems.total > 0 && this.props.international;
  }

  async submit() {
    const { code, address, cart, billingItems, voucher, creditCard, handleError }: ISavedStripeMethod = this.props;

    await this.checkout({
      code,
      address,
      cart: this.resolveCart(cart),
      shipping: this.shipping,
      accountCredit: billingItems.usedCredit,
      voucher: this.resolveVoucher(voucher),
      method: this.method,
      methodData: creditCard.id
    }, (res: CheckoutResponse) => {
      history.push(`/cart/checkout/thank-you/${res.code}`);
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
            <span className={styles.customControlDescription}>{this.props.t('orders:ENDING_IN')}  <b>{this.props.creditCard.lastDigits}</b></span>
          </label>      
    
          <div className={`${styles.shippingFee} ${styles.freeShipping}`}>
            {this.props.t('orders:FREE_SHIPPING')}
          </div>
        </div>
      </div>
    );
  }
}

export default translate('orders')(SavedStripe);
