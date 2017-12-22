import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Elements } from 'react-stripe-elements';

import { history } from '../../router';
import { Button, LoadingSpinner } from '../../common';
import { Free } from './free';
import { COD } from './cod';
import { SavedCC } from './saved-cc';
import { CC } from './cc';
import { SavedStripe } from './saved-stripe';
import { ATM } from './atm';
import { Stripe } from './stripe';
import { InternationalNote } from './international-note';
import { CheckoutBtn } from './checkout-btn';

import { updateCart, removeCartItems } from '../../redux/cart.redux';
import { isGuest, updateUser, getEmail, getCurrentLang } from '../../redux/user.redux';
import { AddressProps } from '../../api/addresses';
import { CartItemProps } from '../../api/cart';
import { CreditCardProps } from '../../api/credit-cards';
import { getCheckout, checkout, updateFailedCheckout, reCheckout } from '../../api/checkout';
import { BillingItemsProps } from '../checkout';
import { PaymentMethodProps } from './payment-method';
import { VoucherProps } from '../../api/vouchers';

import * as styles from './payment.scss';

type PaymentProps = {
  isGuest: boolean,
  code: string,
  email: string,
  language: string,
  creditCards: CreditCardProps[],
  cardService: string,
  address: {
    shipping: AddressProps,
    billing: AddressProps
  },
  cart: CartItemProps[],
  billingItems: BillingItemsProps,
  voucher: VoucherProps,
  updateVoucher: Function,
  updateBillingItems: Function,
  error: string,
  // redux
  updateCart: Function,
  updateUser: Function,
  removeCartItems: Function,
  // others
  className?: string,
  t?: Function
};

type PaymentState = {
  lastPaymentMethod: PaymentMethodProps,
  paymentMethod: PaymentMethodProps,
  submitted: boolean,
  isInProgress: boolean,
  error: string
};

class Payment extends Component<PaymentProps, PaymentState> {
  constructor(props: PaymentProps) {
    super(props);

    this.state = {
      lastPaymentMethod: null,
      paymentMethod: null,
      submitted: false,
      isInProgress: false,
      error: props.error
    };

    this.removeIntProducts = this.removeIntProducts.bind(this);
    this.submit = this.submit.bind(this);
    this.handleError = this.handleError.bind(this);
    this.updatePaymentMethod = this.updatePaymentMethod.bind(this);
  }

  countIntProducts(cart: CartItemProps[] = this.props.cart) {
    return cart.filter((cartItem: CartItemProps) => cartItem.categories && cartItem.categories.indexOf('International') !== -1).length;
  }

  async removeIntProducts() {
    this.setState({
      isInProgress: true,
      error: null
    });

    const cartItemIds: string[] = this.props.cart.reduce((ids: string[], cartItem: CartItemProps) => {
      if (cartItem.categories && cartItem.categories.indexOf('International') !== -1) {
        ids.push(cartItem.id);
      }

      return ids;
    }, []);

    try {
      await this.props.removeCartItems(cartItemIds);

      this.setState({
        isInProgress: false
      });
    } catch(error) {
      this.setState({
        isInProgress: false,
        error: error.message
      });
    }
  }

  submit(e: any) {
    e.preventDefault();

    this.setState({
      submitted: true,
      isInProgress: true,
      error: null
    });
  }

  handleError({ message, data }: { message: string, data?: { code?: string, cart?: CartItemProps[], accountCredit?: number, voucher?: VoucherProps } }) {
    if (data) {
      // handle re-checkout for stripe
      if (Object.getOwnPropertyNames(data).indexOf('code') !== -1) {
        history.replace(`/cart/checkout?Ref=${data.code}${message ? `&errorMsg=${message}` : ''}`);
        return;
      }

      // update cart
      if (Object.getOwnPropertyNames(data).indexOf('cart') !== -1) {
        this.props.updateCart(data.cart);
      }

      // update account credit
      if (Object.getOwnPropertyNames(data).indexOf('accountCredit') !== -1) {
        this.props.updateUser({
          accountCredit: data.accountCredit
        });
      }

      // update voucher
      if (Object.getOwnPropertyNames(data).indexOf('voucher') !== -1) {
        this.props.updateVoucher(data.voucher);
      }
    }

    // display error
    this.setState({
      submitted: false,
      isInProgress: false,
      error: this.props.t(message)
    });
  }

  updatePaymentMethod(paymentMethod: PaymentMethodProps) {
    if (paymentMethod) {
      const { method, value, isCC, first4, first6 }: PaymentMethodProps = paymentMethod;

      if (!this.state.paymentMethod || this.state.paymentMethod.method !== method || this.state.paymentMethod.value !== value || this.state.paymentMethod.isCC !== isCC || this.state.paymentMethod.first4 !== first4 || this.state.paymentMethod.first6 !== first6) {
        this.setState({
          lastPaymentMethod: this.state.paymentMethod,
          paymentMethod
        }, () => {
          this.props.updateBillingItems(paymentMethod);
        });
      }
    }
  }

  componentWillReceiveProps(nextProps: PaymentProps) {
    // from FREE to not free anymore, select back the last method
    if (this.props.billingItems.total === 0 && nextProps.billingItems.total > 0) {
      this.setState({
        lastPaymentMethod: null,
        paymentMethod: this.state.lastPaymentMethod
      });
    }

    // after removing international products, set paymentMethod to null, then the new method will be selected
    if (this.countIntProducts() > 0 && this.countIntProducts(nextProps.cart) === 0) {
      this.setState({
        paymentMethod: null
      });
    }
  }

  render() {
    const numIntProducts = this.countIntProducts();

    return (
      <div className={this.props.className || ''}>
        <div className={`${styles.proceedCheckout} ${styles.card}`}>
          <div className={styles.cardBlock}>
            <h4 className={styles.cardTitle}>{this.props.t('orders:SELECT_PAYMENT_OPTION')}</h4>

            {!!numIntProducts && <InternationalNote
              onlyInternational={numIntProducts === this.props.cart.length || !!this.props.code} 
              numIntProducts={numIntProducts}
              removeIntProducts={this.removeIntProducts} />}

            {/* payment options */}
            <div className={styles.paymentOptions}>
              <COD
                selectedMethod={this.state.paymentMethod}
                updatePaymentMethod={this.updatePaymentMethod}

                code={this.props.code}
                email={this.props.email}
                address={this.props.address}
                cart={this.props.cart}
                international={!!numIntProducts}
                billingItems={this.props.billingItems}
                voucher={this.props.voucher}

                submitted={this.state.submitted}
                handleError={this.handleError} 
                updateCart={this.props.updateCart}/>

              {/* <ATM
                selectedMethod={this.state.paymentMethod}
                updatePaymentMethod={this.updatePaymentMethod}

                language={this.props.language}
                code={this.props.code}
                email={this.props.email}
                address={this.props.address}
                cart={this.props.cart}
                international={!!numIntProducts}
                billingItems={this.props.billingItems}
                voucher={this.props.voucher}

                submitted={this.state.submitted}
                handleError={this.handleError} 
                updateCart={this.props.updateCart}/> */}

              { !this.props.isGuest && this.props.creditCards.map((creditCard: CreditCardProps, index: number) => {
                const SavedCard = creditCard.provider === 'STRIPE' ? SavedStripe : SavedCC;

                return <SavedCard
                  key={index}
                  selectedMethod={this.state.paymentMethod}
                  updatePaymentMethod={this.updatePaymentMethod}

                  code={this.props.code}
                  address={this.props.address}
                  cart={this.props.cart}
                  international={!!numIntProducts}
                  billingItems={this.props.billingItems}
                  voucher={this.props.voucher}

                  creditCard={creditCard}

                  submitted={this.state.submitted}
                  handleError={this.handleError} 
                  updateCart={this.props.updateCart} />
              }) }

              <CC
                selectedMethod={this.state.paymentMethod}
                updatePaymentMethod={this.updatePaymentMethod}

                isGuest={this.props.isGuest}
                code={this.props.code}
                email={this.props.email}
                address={this.props.address}
                cart={this.props.cart}
                international={!!numIntProducts}
                billingItems={this.props.billingItems}
                voucher={this.props.voucher}

                submitted={this.state.submitted}
                handleError={this.handleError} 
                updateCart={this.props.updateCart}/>

              <Elements>
                <Stripe
                  selectedMethod={this.state.paymentMethod}
                  updatePaymentMethod={this.updatePaymentMethod}

                  isGuest={this.props.isGuest}
                  code={this.props.code}
                  email={this.props.email}
                  address={this.props.address}
                  cart={this.props.cart}
                  international={!!numIntProducts}
                  billingItems={this.props.billingItems}
                  voucher={this.props.voucher}

                  submitted={this.state.submitted}
                  handleError={this.handleError} 
                  updateCart={this.props.updateCart} />
              </Elements>

              <Free
                selectedMethod={this.state.paymentMethod}
                updatePaymentMethod={this.updatePaymentMethod}

                code={this.props.code}
                email={this.props.email}
                address={this.props.address}
                cart={this.props.cart}
                international={!!numIntProducts}
                billingItems={this.props.billingItems}
                voucher={this.props.voucher}

                submitted={this.state.submitted}
                handleError={this.handleError} 
                updateCart={this.props.updateCart}/>
            </div>

            <hr />

            {/* checkout button */}
            <form noValidate onSubmit={this.submit}>
              <CheckoutBtn isInProgress={this.state.isInProgress} />
            </form>

            {/* display error messages */}
            {this.state.error && <div className="text-center text-danger">
              {this.props.t(`orders:${this.state.error}`)}
            </div>}
          </div>
        </div>

        <div className={styles.securedLabel} />

        <div className={`${styles.backdrop} ${this.state.isInProgress ? styles.show : ''}`} >
          <LoadingSpinner outerCircle={true} />
        </div>
      </div>
    );
  }
}

export default connect((state) => ({
  isGuest: isGuest(state),
  email: getEmail(state),
  language: getCurrentLang(state)
}), {
  updateCart,
  updateUser,
  removeCartItems
})(translate(['common', 'orders', 'auth'])(Payment)) as any;
