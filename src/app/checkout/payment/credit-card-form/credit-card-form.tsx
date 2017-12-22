import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import * as Payment from 'payment';
const Card: any = require('card-react');

import { Row } from '../../../common';

import * as styles from './credit-card-form.scss';

type CardFormProps = {
  updateCreditCard: Function,
  service?: string,
  className?: string,
  t?: Function
};

type CardFormState = {
  cardName?: string,
  cardNumber: string,
  expiry: string,
  cvv: string,
  [key: string]: string,
  validation?: any
};

type ValidationProps = {
  cardName?: boolean,
  cardNumber: boolean,
  expiry: boolean,
  cvv: boolean
};

class CreditCardForm extends Component<CardFormProps, CardFormState> {
  constructor(props: CardFormProps) {
    super(props);

    this.state = {
      cardName: props.service === 'STRIPE' ? undefined : '',
      cardNumber: '',
      expiry: '',
      cvv: ''
    };
  }

  onChange(field: string, value: string) {
    this.setState({ [field]: value }, () => {
      const { cardName, cardNumber, expiry, cvv } = this.state;
      const validation: ValidationProps = {
        cardName: cardName ? (this.props.service === 'STRIPE' ? undefined : !!cardName) : true,
        cardNumber: cardNumber ? Payment.fns.validateCardNumber(cardNumber) : true,
        expiry: expiry ? Payment.fns.validateCardExpiry(expiry) : true,
        cvv: cvv ? Payment.fns.validateCardCVC(cvv): true
      };
      this.setState({
        validation
      })

      if ((this.props.service === 'STRIPE' || validation.cardName) && (cardNumber && expiry && cvv && validation.cardNumber && validation.expiry && validation.cvv)) {
        this.props.updateCreditCard({
          cardName,
          cardNumber: cardNumber.replace(/ /g, ''),
          type: Payment.fns.cardType(cardNumber),
          expiry: Payment.fns.cardExpiryVal(expiry),
          cvv
        });
      } else {
        this.props.updateCreditCard();
      }
    });
  }

  render() {
    return (
      <Row className={styles.ccFormContainer}>
        <div className={`${styles.colLg6} ${styles.ccFormWrap}`}>
          <Card
            container="card-container"
            formInputsNames={{
              name: 'cc-name',
              number: 'cc-number',
              expiry: 'cc-exp',
              cvc: 'cc-cvc'
            }}>
            <form noValidate autoComplete="on">
              {this.props.service !== 'STRIPE' && <div className={styles.formGroup}>
                <label className={styles.formControlLabel}>{this.props.t('orders:CARDHOLDER_NAME')}</label>
                <input 
                  className={`${styles.formControl} ${this.state.validation && !this.state.validation['cardName'] ? styles.invalidField : ''}`} 
                  type="text" 
                  placeholder={this.props.t('orders:CARDHOLDER_NAME')} 
                  name="cc-name" required autoComplete="cc-name" 
                  onBlurCapture={(e: any) => this.onChange('cardName', e.target.value)} />

                <div className={`${styles.errorText} text-danger`}>{this.props.t('orders:ERROR_NO_CARD_HOLDER')}</div>
              </div>}

              <div className={styles.formGroup}>
                <label className={styles.formControlLabel}>{this.props.t('orders:CARD_NUMBER')}</label>
                <span className={styles.cardList}>
                  <img src={`/images/${this.props.service === 'STRIPE' ? 'credit-card-list-stripe' : 'credit-card-list'}.jpg`}/>
                </span>
                <input 
                  className={`${styles.formControl} ${this.state.validation && !this.state.validation['cardNumber'] ? styles.invalidField : ''}`} 
                  type="text" 
                  name="cc-number" 
                  placeholder={'•••• •••• •••• ••••'} 
                  required 
                  pattern="\d*" 
                  onBlurCapture={(e: any) => this.onChange('cardNumber', e.target.value)} />
                
                <div className={`${styles.errorText} text-danger`}>{this.props.t('orders:ERROR_INVALID_CARD')}</div>
              </div>

              <Row className={styles.formGroup}>
                <div className={styles.col6}>
                  <label className={styles.formControlLabel}>{this.props.t('orders:CARD_EXPIRED_DATE')}</label>
                  <input 
                    className={`${styles.formControl} ${this.state.validation && !this.state.validation['expiry'] ? styles.invalidField : ''}`} 
                    type="text" 
                    name="cc-exp" 
                    autoComplete="cc-exp" 
                    placeholder="MM / YY" 
                    maxLength={7} 
                    required 
                    onBlurCapture={(e: any) => this.onChange('expiry', e.target.value)} />

                  <div className={`${styles.errorText} text-danger`}>{this.props.t('orders:ERROR_INVALID_EXPIRY')}</div>
                </div>

                <div className={`${styles.col6}`}>
                  <label className={styles.formControlLabel}>{this.props.t('orders:CARD_CVV')}</label>
                  <input 
                    className={`${styles.formControl} ${this.state.validation && !this.state.validation['cvv'] ? styles.invalidField : ''}`} 
                    type="text" 
                    placeholder="•••" 
                    name="cc-cvc" 
                    required 
                    autoComplete="off" 
                    onBlurCapture={(e: any) => this.onChange('cvv', e.target.value)} />

                  <div className={`${styles.errorText} text-danger`}>{this.props.t('orders:ERROR_CVV')}</div>
                </div>
              </Row>
            </form>
          </Card>
        </div>

        <div id="card-container" className={`${styles.colLg6} ${styles.realCardWrap}`}></div>
      </Row>
    );
  }
}

export default translate(['common'])(CreditCardForm);