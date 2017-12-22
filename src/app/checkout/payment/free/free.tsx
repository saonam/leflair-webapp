import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { PaymentMethod, IPaymentMethod } from '../payment-method';

import * as styles from './free.scss';

class Free extends PaymentMethod<IPaymentMethod, {}> {
  method = 'FREE';
  shipping = 0;

  isValid() {
    return this.props.billingItems.total === 0;
  }

  render() {
    return this.isValid() && (
      <div className={this.props.className || ''}>
        <div className={`${styles.option} ${styles.active}`}>
            <div className={`${styles.heading} clearfix`}>
                {this.props.t('orders:FREE_PAYMENT')}
            </div>
        </div>
      </div>
    );
  }

  async componentDidUpdate(prevProps: IPaymentMethod) {
    // auto select FREE payment if it is valid and not selected
    if (this.isValid() && !this.isSelected()) {
      this.select();
      return;
    }

    // submit checkout
    if (this.isSelected() && this.props.submitted && !prevProps.submitted) {
      await this.submit();
    }
  }
}

export default translate('orders')(Free);
