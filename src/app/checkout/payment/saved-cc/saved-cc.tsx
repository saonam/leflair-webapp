import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Row } from '../../../common';
import { CreditCardProps } from '../../../api/credit-cards';
import { PaymentMethod, CheckoutResponse, IPaymentMethod } from '../payment-method';
import { getTransaction } from '../transaction';

import * as styles from './saved-cc.scss';

interface ISavedCCMethod extends IPaymentMethod {
  creditCard: CreditCardProps;
}

interface ISavedCCState {
  cvv: string;
}

class SavedCC extends PaymentMethod<ISavedCCMethod, ISavedCCState> {
  method = 'CC';
  value = this.props.creditCard.id;
  shipping = 0;
  isCC = true;

  constructor(props: ISavedCCMethod) {
    super(props);

    this.state = {
      cvv: ''
    };
  }

  async submit() {
    const { code, address, cart, billingItems, voucher, creditCard, handleError }: ISavedCCMethod = this.props;
    const { cvv }: ISavedCCState = this.state;

    if (!cvv) {
      return handleError({
        message: 'ERROR_PLEASE_FILL_CVV'
      });
    }

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
      getTransaction()
        .addCode(res.code)
        .addClientData({ cvv })
        .addServerData(res.creditCard)
        .processPayment();
    });
  }

  render() {
    return this.isValid() && (
      <div className={`${styles.option} ${styles.creditCard} ${this.isSelected() ? styles.active : ''}`} onClick={this.select}>
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
    
        <Row className={styles.creditCardForm}>
          <form className={`${styles.colMd5} ${styles.colLg4}`} name="form">
            <div className={styles.formGroup}>
              <div className={styles.formGroup}>
                <label className={styles.formControlLabel}>{this.props.t('orders:RE_ENTER_CARD_CVV')}</label>
    
                <div className={styles.cvvField}>
                  <input
                    className={styles.formControl}
                    type="tel"
                    name="cvv"
                    value={this.state.cvv}
                    onChange={(e: any) => this.changeField('cvv', e.target.value)}
                    placeholder={this.props.t('orders:CARD_CVV')}
                    maxLength={4}
                    required />
    
                  <a href="javascript:void(0)" className={`${styles.btnHelp} ic-ic-help`}>
                    <div className={styles.tooltip} role="tooltip">
                      <div className={styles.tooltipInner}>
                        <img className={styles.cvvHelpImage} src="/images/cvc-example.jpg"/>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </form>
        </Row>
      </div>
    );
  }
}

export default translate('orders')(SavedCC);
