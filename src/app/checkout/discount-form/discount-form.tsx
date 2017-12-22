import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { formatMoney, Button } from '../../common';

import * as styles from './discount-form.scss';

import { getVoucher, VoucherProps } from '../../api/vouchers';
import { getGiftCard, redeemGiftCard } from '../../api/gift-cards';
import { PaymentMethodProps } from '../payment/payment-method';
import { Row } from '../../common';

type DiscountFormProps = {
  paymentMethod: PaymentMethodProps,
  total: number,
  redeem: Function,
  className?: string,
  t?: Function
};

type DiscountFormState = {
  code: string,
  voucher: VoucherProps,
  giftcard: any,
  amount: number,
  discountType: string,
  isValid: boolean,
  error: string,
  isRedeeming: boolean
};

class DiscountForm extends Component<DiscountFormProps, DiscountFormState> {
  constructor(props: DiscountFormProps) {
    super(props);

    this.state = {
      code: '',
      voucher: null,
      giftcard: null,
      amount: 0,
      discountType: '',
      isValid: false,
      error: null,
      isRedeeming: false
    };

    this.validate = this.validate.bind(this);
    this.resolveAmount = this.resolveAmount.bind(this);
    this.redeem = this.redeem.bind(this);
    this.isVoucher = this.isVoucher.bind(this);
    this.onChange = this.onChange.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  resolveVoucherError(voucher: VoucherProps, { isCC }: PaymentMethodProps) {
    if (!isCC) {
      return 'REQUIRES_CC_PAYMENT';
    }

    return;
  }

  async validate() {
    if (!this.state.code.trim().length) {
      return;
    }

    this.setState({
      isValid: false
    });

    try {
      const voucher: VoucherProps = await getVoucher(this.state.code);

      // verify minimum purchase
      if (this.props.total < voucher.minimumPurchase) {
        this.setState({
          error: this.props.t('NOT_MEET_MINIMUM_PURCHASE', { value: formatMoney(voucher.minimumPurchase) })
        });
        return;
      }

      // verify for CC only
      if (voucher.binRange) {
        const error = this.resolveVoucherError(voucher, this.props.paymentMethod);

        if (error) {
          this.setState({
            error: this.props.t(error)
          });
          return;
        }
      }

      this.setState({
        voucher,
        giftcard: null,
        amount: voucher.amount,
        discountType: voucher.discountType,
        isValid: true
      });
    } catch(error) {
      try {
        const giftcard: any = await getGiftCard(this.state.code);
        this.setState({
          voucher: null,
          giftcard,
          amount: giftcard.amount,
          discountType: 'amount',
          isValid: true
        });
      } catch(error) {
        this.setState({
          error: this.props.t(error.message)
        });
      }
    }
  }

  resolveAmount() {
    if (this.state.discountType === 'amount') {
      return this.state.amount;
    }

    if (this.state.discountType === 'percentage') {
      return Math.floor(this.state.amount * this.props.total);
    }

    return 0;
  }

  async redeem() {
    if (!this.state.code.trim().length) {
      return;
    }

    if (this.isVoucher()) {
      this.props.redeem({
        type: 'voucher',
        ...this.state.voucher
      });
    } else {
      try {
        this.setState({ isRedeeming: true });
        await redeemGiftCard(this.state.giftcard.id);
        this.setState({ isRedeeming: false });

        this.props.redeem({
          type: 'giftcard',
          id: this.state.giftcard.id,
          amount: this.state.giftcard.amount,
          discountType: 'amount'
        });
      } catch(error) {
        this.setState({
          error: this.props.t(error.message)
        });
      }
    }
  }

  cancel() {
    this.setState({
      voucher: null,
      giftcard: null,
      amount: 0,
      discountType: '',
      isValid: false,
      error: null,
      isRedeeming: false,
    })
  }

  isVoucher() {
    return this.state.voucher && !this.state.giftcard;
  }

  onChange(code: string) {
    const newState: any = this.state.isValid ? {
      code,
      voucher: null,
      giftcard: null,
      amount: 0,
      discountType: '',
      isValid: false,
      error: null
    } : {
      code,
      error: null
    };

    this.setState(newState);
  }

  generateHelpText() {
    const discount = this.resolveAmount();

    if (!this.isVoucher()) {
      return this.props.t('orders:GIFTCARD_VALUE', { value: formatMoney(discount) });
    }

    const helpText = discount > 0 ? [this.props.t('orders:DISCOUNT_VALUE', {
      value: formatMoney(discount)
    })] : [];
    
    if (this.state.voucher.freeShipping) {
      helpText.push(this.props.t('orders:FREE_SHIPPING'));
    }

    return `${helpText.join(', ')}.`;
  }

  render() {
    return (
      <div>
        {!this.state.isValid ? <div className={styles.inputGroup}>
            <input type="text" className={styles.formControl} placeholder={this.props.t('orders:ENTER_DISCOUNT')} value={this.state.code} onChange={(e) => this.onChange(e.target.value)} />
            <span className={styles.inputGroupBtn}>
              <Button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnRedeem}`} type="button" onClick={this.validate}>
                {this.props.t('orders:VALIDATE_DISCOUNT')}
              </Button>
            </span>
        </div> : 
          <Row className={`${styles.buttonsRow} ${styles.resetPadding}`}>
          {this.state.isValid && <div className={styles.discountValue}>
            {this.generateHelpText()}
              <div>{this.props.t('orders:REDEEM_CONFIRM')}</div>
          </div>}
            <Button className={`${styles.btn} ${styles.btnSecondary} ${styles.col6}`} type="button" onClick={this.cancel} isBusy={this.state.isRedeeming}>
              {this.props.t('CANCEL')}
            </Button>
            <Button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnRedeem} ${styles.col6}`} type="button" onClick={this.redeem} isBusy={this.state.isRedeeming}>
              {this.props.t('orders:REDEEM')}
            </Button>
        </Row>
      }
        
        {!this.state.isValid && this.state.error && <div className={styles.error}>
          {this.state.error}
        </div>}
      </div>
    );
  }
}

export default translate(['common', 'orders'])(DiscountForm);