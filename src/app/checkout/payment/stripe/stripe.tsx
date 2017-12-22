import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { injectStripe } from 'react-stripe-elements';

import { Row } from '../../../common';
import { history } from '../../../router';
import { PaymentMethod, CheckoutResponse, IPaymentMethod } from '../payment-method';
import { StripeForm } from './stripe-form';

import * as styles from './stripe.scss';

interface IStripeMethod extends IPaymentMethod {
  stripe?: any;
}

interface IStripeState {
  isCardValid: boolean;
  saveCard: boolean;
}

class Stripe extends PaymentMethod<IStripeMethod, IStripeState> {
  method = 'STRIPE';
  shipping = 0;
  isCC = true;

  constructor(props: IStripeMethod) {
    super(props);

    this.state = {
      isCardValid: false,
      saveCard: !props.isGuest
    };
  }
  
  isValid() {
    return this.props.billingItems.total > 0 && this.props.international;
  }

  async submit() {
    const { code, email, address, cart, billingItems, voucher, handleError }: IStripeMethod = this.props;
    const { isCardValid, saveCard }: IStripeState = this.state;

    if (!isCardValid) {
      return handleError({
        message: 'ERROR_PLEASE_FILL_ALL'
      });
    }

    const { source, error }: any = await this.props.stripe.createSource({ type: 'card' });

    if (error) {
      return handleError({
        message: error.message
      });
    }

    await this.checkout({
      code,
      email,
      address,
      cart: this.resolveCart(cart),
      shipping: this.shipping,
      accountCredit: billingItems.usedCredit,
      voucher: this.resolveVoucher(voucher),
      method: this.method,
      saveCard,
      methodData: source
    }, (res: CheckoutResponse) => {
      history.push(`/cart/checkout/thank-you/${res.code}`);
    });
  }

  render() {
    return this.isValid() && (
      <div className={`${styles.option} ${styles.creditCard} ${this.isSelected() ? styles.active : ''}`} onClick={this.select}>
        <div className={`clearfix ${styles.heading}`}>
          <label className={`${styles.customControl} ${styles.customRadio}`}>
            <input
              id="input-credit-card"
              name="radio"
              type="radio"
              className={styles.customControlInput}
              checked={this.isSelected()}
              readOnly />

            <span className={styles.customControlIndicator}></span>
            <span className={styles.customControlDescription}>{this.props.t('orders:CREDIT_CARD')}</span>
          </label>

          <div className={`${styles.shippingFee} ${styles.freeShipping}`}>
            {this.props.t('orders:FREE_SHIPPING')}
          </div>
        </div>
    
        <Row className={styles.creditCardForm}>
          <div className={`${styles.colMd8} ${styles.colLg7}`}>
            <StripeForm updateValidity={(isCardValid: boolean) => this.changeField('isCardValid', isCardValid)} />
            
            {!this.props.isGuest && <div className={styles.formGroup}>
              <label className={`${styles.customControl} ${styles.customCheckbox}`}>
                <input
                  className={styles.customControlInput}
                  type="checkbox"
                  name="saveCard"
                  checked={this.state.saveCard}
                  onChange={(e) => this.changeField('saveCard', e.target.checked)} />

                <span className={styles.customControlIndicator}></span>
                <span className={styles.customControlDescription}>{this.props.t('orders:SAVE_CARD_FOR_FUTURE_USE')}</span>
              </label>
            </div>}
          </div>
        </Row>
      </div>
    );
  }
}

export default injectStripe(translate('orders')(Stripe) as any) as any;
