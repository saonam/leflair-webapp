import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Row } from '../../../common';
import { CreditCardForm } from '../credit-card-form';
import { PaymentMethod, CheckoutResponse, IPaymentMethod } from '../payment-method';
import { getTransaction } from '../transaction';
import { CreditCardProps } from '../payment-method';

import * as styles from './cc.scss';

interface ICCState {
  creditCard: CreditCardProps;
  saveCard: boolean;
}

class CC extends PaymentMethod<IPaymentMethod, ICCState> {
  method = 'CC';
  shipping = 0;
  isCC = true;

  constructor(props: IPaymentMethod) {
    super(props);

    this.state = {
      creditCard: null,
      saveCard: !props.isGuest
    };

    this.updateCreditCard = this.updateCreditCard.bind(this);
  }

  updateCreditCard(creditCard: CreditCardProps) {
    this.first4 = creditCard && parseInt(creditCard.cardNumber.substr(0, 4)) || undefined;
    this.first6 = creditCard && parseInt(creditCard.cardNumber.substr(0, 6)) || undefined;
    this.changeField('creditCard', creditCard, this.select);
  }

  isBinValid = (ranges: Array<Array<number>>, first4: number, first6: number) => ranges.some(([ from, to ]: Array<number>) => (`${from}`.length === 4 && first4 >= from && first4 <= to) || (`${from}`.length === 6 && first6 >= from && first6 <= to));

  async submit() {
    const { code, email, address, cart, billingItems, voucher, handleError }: IPaymentMethod = this.props;
    const { creditCard, saveCard }: ICCState = this.state;

    if (!creditCard) {
      return handleError({
        message: 'ERROR_PLEASE_FILL_ALL'
      });
    }

    if (voucher && !this.isBinValid(voucher.binRange, this.first4, this.first6)) {
      return handleError({
        message: 'THIS_CC_NOT_ACCEPTABLE'
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
    }, (res: CheckoutResponse) => {
      getTransaction()
        .addCode(res.code)
        .addClientData(creditCard)
        .addServerData(res.creditCard)
        .processPayment();
    });
  }

  render() {
    return this.isValid() && (
      <div className={`${styles.option} ${styles.creditCard} ${this.isSelected() ? styles.active : ''}`} onClick={this.select}>
        <div className={`${styles.heading}`}>
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

        <div className={styles.creditCardForm}>
            <CreditCardForm updateCreditCard={this.updateCreditCard} />
            
            {!this.props.isGuest && <div className={`${styles.saveCard} ${styles.formGroup}`}>
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
      </div>
    );
  }
}

export default translate('orders')(CC);
