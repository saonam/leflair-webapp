import * as React from 'react';
import { translate } from 'react-i18next';

import { Row, Currency, SignInLink } from '../../common';

import { CartItemProps } from '../../api/cart';
import { ReCheckoutCartItemProps } from '../checkout';
import { DiscountForm } from '../discount-form';
import { PaymentMethodProps } from '../payment/payment-method';

import * as styles from './order-summary.scss';

type OrderSummaryProps = {
  isGuest: boolean,
  paymentMethod: PaymentMethodProps,
  numCartItems: number,
  voucher: any,
  billingItems: any,
  redeemCode: Function,
  removeVoucher: Function,
  className?: string,
  t?: Function
};

const OrderSummary: React.SFC<OrderSummaryProps> = (props) => (
  <div className={`${styles.orderSummary} ${styles.card}`}>
      <div className={styles.cardBlock}>
          <h4 className={styles.cardTitle}>{props.t('orders:SUMMARY')} ({props.numCartItems} {props.t('ITEMS')})</h4>
          <div>
              <Row className={styles.subtotal}>
                  <div className={styles.col6}>{props.t('orders:SUBTOTAL')}</div>
                  <Currency className={`${styles.col6} text-right`} amount={props.billingItems.subtotal} />
              </Row>

              <Row className={styles.shipping}>
                  <div className={styles.col6}>{props.t('orders:SHIPPING')}</div>
                  <div className={`${styles.col6} text-right`}>
                    {props.voucher && props.voucher.freeShipping && props.t('FREE') || <Currency amount={props.billingItems.shipping} />}
                  </div>
              </Row>

              {props.billingItems.usedCredit > 0 && <Row className={styles.credit}>
                  <div className={styles.col6}>{props.t('orders:CREDIT')}</div>
                  <Currency className={`${styles.col6} text-right`} amount={-props.billingItems.usedCredit} />
              </Row>}

              {props.voucher && <Row className={styles.voucher}>
                  <div className={styles.col6}>
                      {props.t('orders:VOUCHER')} {props.voucher && `(${props.voucher.code})`}
                      <a className={styles.btnRemoveVoucher} href="javascript:void(0)" onClick={() => props.removeVoucher()}>
                        <span className={`ic-ic-close ${styles.icon}`}></span>
                      </a>
                  </div>
                  <div className={`${styles.col6} text-right`}>
                    <Currency amount={-props.billingItems.voucher} />
                    {props.paymentMethod && props.paymentMethod.isCC && <div className={styles.voucherHelpText}>{props.t('orders:CC_ONLY').toUpperCase()}</div>}
                  </div>
              </Row>}

              { !props.isGuest && <Discount
                paymentMethod={props.paymentMethod}
                total={props.billingItems.subtotal + props.billingItems.shipping - props.billingItems.accountCredit}
                redeemCode={props.redeemCode} /> }
              
              { props.isGuest && <div>
                <SignInLink>{props.t('orders:SIGNIN_TO_ADD_CREDITS')}</SignInLink>
              </div> }

              <hr />

              <Row className={styles.total} id="order-summary">
                  <div className={styles.col6}>{props.t('orders:TOTAL')}</div>
                  <Currency className={`${styles.col6} text-right`} amount={props.billingItems.total} />
              </Row>
          </div>
      </div>
  </div>
);

export default translate(['common', 'orders'])(OrderSummary);

type DiscountComponentProps = {
  paymentMethod: PaymentMethodProps,
  total: number,
  redeemCode: Function,
  className?: string,
  t?: Function
};

type DiscountComponentState = {
  discountFormVisible: boolean
};

class DiscountComponent extends React.Component<DiscountComponentProps, DiscountComponentState> {
  constructor(props: DiscountComponentProps) {
    super(props);

    this.state = {
      discountFormVisible: false
    };

    this.onRedeemCode = this.onRedeemCode.bind(this);
  }

  onRedeemCode(code: any) {
    this.setState({
      discountFormVisible: false
    });

    this.props.redeemCode(code);
  }

  render() {
    return (
      <Row className={styles.giftCard}>
      {!this.state.discountFormVisible ? (
        <div className={styles.col12}>
          <a href="javascript:void(0)" onClick={() => this.setState({
            discountFormVisible: true
          })}>{this.props.t('orders:ENTER_DISCOUNT')}</a>
        </div>
      ) : (
        <div className={styles.col12}>
          <DiscountForm
            paymentMethod={this.props.paymentMethod}
            total={this.props.total}
            redeem={this.onRedeemCode} />
        </div>
      )}
      </Row>
    );
  }
}

const Discount = translate('orders')(DiscountComponent);
