import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { CardNumberElement, CardExpiryElement, CardCVCElement, injectStripe } from 'react-stripe-elements';

import { Row } from '../../../../common';

import * as styles from './stripe-form.scss';

type StripeFormProps = {
  updateValidity: Function,
  className?: string,
  t?: Function
};

type StripeFormState = {
  validity: {
    cardNumber: boolean,
    expiry: boolean,
    cvc: boolean
  },
  errors: {
    cardNumber: string,
    expiry: string,
    cvc: string
  }
};

class StripeForm extends Component<StripeFormProps, any> {
  constructor(props: StripeFormProps) {
    super(props);

    this.state = {
      validity: {
        cardNumber: false,
        expiry: false,
        cvc: false
      },
      errors: {
        cardNumber: null,
        expiry: null,
        cvc: null
      }
    };

    this.change = this.change.bind(this);
  }

  isCardValid() {
    return this.state.validity.cardNumber && this.state.validity.expiry && this.state.validity.cvc;
  }

  change(field: string, { complete, error }: any) {
    this.setState({
      validity: {
        ...this.state.validity,
        [field]: complete
      },
      errors: {
        ...this.state.errors,
        [field]: error && error.message || null
      }
    }, () => this.props.updateValidity(this.isCardValid()));
  }

  render() {
    return (
      <div>
        <div className={styles.formGroup}>
          <label className={styles.formControlLabel}>{this.props.t('orders:CARD_NUMBER')}</label>
          <span className={styles.cardList}>
            <img src="/images/credit-card-list-stripe.jpg"/>
          </span>

          <CardNumberElement className={styles.formControl} onChange={(res: any) => this.change('cardNumber', res)} />

          {this.state.errors.cardNumber && <div className="text-danger">
            {this.props.t(`orders:${this.state.errors.cardNumber}`)}
          </div>}
        </div>

        <Row className={styles.formGroup}>
          <div className={styles.col6}>
            <label className={styles.formControlLabel}>{this.props.t('orders:CARD_EXPIRED_DATE')}</label>
            
            <CardExpiryElement className={styles.formControl} onChange={(res: any) => this.change('expiry', res)} />
          </div>

          <div className={styles.col6}>
            <label className={styles.formControlLabel}>{this.props.t('orders:CARD_CVV')}</label>

            <CardCVCElement className={styles.formControl} onChange={(res: any) => this.change('cvc', res)} />
          </div>

          {(this.state.errors.expiry || this.state.errors.cvc) && <div className={`text-danger ${styles.col12}`}>
            {this.props.t(`orders:${this.state.errors.expiry || this.state.errors.cvc}`)}
          </div>}
        </Row>
      </div>
    );
  }
}

export default translate('checkout')(StripeForm);