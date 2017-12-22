import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import * as qs from 'qs';

import { CheckoutLayout } from '../layouts';
import { Container, Row, } from '../common';
import { OrderSummary } from './order-summary';
import { Address } from './address';
import { OrderDetails } from './order-details';
import { Payment } from './payment';
import { SHIPPING_FEE } from './payment/cod';

import { history } from '../router';
import { readyForCheckout, isGuest, isSignedIn, updateAccountCredit, updateUserEmail, getAccountCredit } from '../redux/user.redux';
import { updateCart, getCart } from '../redux/cart.redux';
import { getAddresses, loadAddresses } from '../redux/address.redux';

import { AddressProps } from '../api/addresses';
import { CreditCardProps } from '../api/credit-cards';
import { getCheckout, updateFailedCheckout } from '../api/checkout';
import { CartItemProps } from '../api/cart';
import { BeginCheckout } from '../api/rtb-house';
import { ProductProps as OrderProductProps } from '../api/orders';
import { PaymentMethodProps } from './payment/payment-method';
import { VoucherProps } from '../api/vouchers';

import * as styles from './checkout.scss';

const DEFAULT_CC_ERROR_MESSAGE = 'DEFAULT_CC_ERROR_MESSAGE';

export type ReCheckoutCartItemProps = {
  title: string,
  image: string,
  quantity: number,
  salePrice: number,
  retailPrice: number
};

type CheckoutComponentProps = {
  isGuest: boolean,
  address: {
    shipping: AddressProps,
    billing: AddressProps
  },
  cart: CartItemProps[],
  creditCards: CreditCardProps[],
  cardService: string,
  accountCredit: number,
  updateAccountCredit: Function,
  t?: Function,
  // failed CC payment respond data
  code?: string,
  voucher?: VoucherProps,
  error?: string
};

type CheckoutComponentState = {
  address: {
    shipping: AddressProps,
    billing: AddressProps
  },
  billingItems: {
    subtotal: number,
    shipping: number,
    voucher: number,
    usedCredit: number,
    total: number
  },
  voucher: VoucherProps,
  paymentMethod: PaymentMethodProps
};

export type BillingItemsProps = {
  subtotal: number,
  shipping: number,
  voucher: number,
  usedCredit: number,
  total: number
};

export const checkoutAction = async (params: any, cookie: any, store: any) => {
  if (!readyForCheckout(store.getState())) {
    return history.replace('/checkout/continue');
  }

  const signedIn = isSignedIn(store.getState());

  // failed payment data
  const { Ref, errorMsg }: { Ref: string, errorMsg: string } = typeof window !== 'undefined' ? qs.parse(location.search.replace('?', '')) : {};
  // get checkout data
  let checkout: any;
  if (Ref) {
    const { products, email, ...rest }: any = await updateFailedCheckout(Ref, errorMsg || DEFAULT_CC_ERROR_MESSAGE);

    store.dispatch(updateUserEmail(email));

    checkout = {
      ...rest,
      cart: products.map(({ id, title, image, quantity, salePrice, retailPrice }: OrderProductProps) => ({
        id,
        title,
        // will refactor this later
        image: `https://leflair-assets.storage.googleapis.com/${image}`,
        quantity,
        salePrice,
        retailPrice
      }))
    };
  } else {
    // load latest address of user/guest
    await store.dispatch(loadAddresses(signedIn));
    // get checkout data
    checkout = await getCheckout();
    // update redux's cart to latest
    store.dispatch(updateCart(checkout.cart));

    const address: any = getAddresses(store.getState());

    // handle missing addresses
    if (!address.shipping) {
      history.replace(`/cart/addresses/shipping${!signedIn ? '/guest' : ''}/create`);
      return;
    }
    if (!address.billing) {
      history.replace(`/cart/addresses/billing${!signedIn ? '/guest' : ''}/create`);
      return;
    }

    checkout.address = address;
  }

  // update user accountCredit
  if (signedIn) {
    store.dispatch(updateAccountCredit(checkout.accountCredit));
  }

  // handle empty cart
  if (checkout.cart.length === 0) {
    history.push('/');
    return;
  }

  return {
    component: <Checkout {...checkout} error={Ref ? errorMsg || DEFAULT_CC_ERROR_MESSAGE : null} />
  };
};

class CheckoutComponent extends Component<CheckoutComponentProps, CheckoutComponentState> {
  constructor(props: CheckoutComponentProps) {
    super(props);

    this.state = {
      address: props.address,
      billingItems: this.calculateBillingItems({
        shipping: this.getDefaultShipping(),
        voucher: props.voucher,
        cart: props.cart
      }),
      voucher: props.voucher,
      paymentMethod: null
    };

    this.calculateBillingItems = this.calculateBillingItems.bind(this);
    this.redeemCode = this.redeemCode.bind(this);
    this.updateVoucher = this.updateVoucher.bind(this);
    this.updateBillingItems = this.updateBillingItems.bind(this);
    this.updateDeliveryNote = this.updateDeliveryNote.bind(this);
  }

  getDefaultShipping() {
    // select COD by default when re-checkout, otherwise CC by default
    return !!this.props.code ? SHIPPING_FEE : 0;
  }

  calculate({ shipping, accountCredit, voucher, cart }: { shipping: number, accountCredit: number, voucher: VoucherProps, cart: CartItemProps[] }): BillingItemsProps {
    // subtotal
    const subtotal = cart.reduce((acc: number, { salePrice, quantity }: CartItemProps | ReCheckoutCartItemProps) => acc + salePrice * quantity, 0);

    // voucher
    const voucherAmount = !voucher
    ? 0
    : voucher.discountType === 'percentage'
    ? Math.floor((subtotal + shipping) * voucher.amount)
    : voucher.discountType === 'amount'
    ? voucher.amount
    : 0;

    // free shipping voucher
    const freeShippingVoucher = voucher && voucher.freeShipping && shipping > 0
    ? shipping
    : 0;

    // used credit
    const usedCredit = subtotal + shipping <= voucherAmount
    ? 0
    : subtotal + shipping <= voucherAmount + accountCredit
    ? subtotal + shipping - voucherAmount
    : accountCredit;

    // total
    const total = subtotal + shipping - voucherAmount - freeShippingVoucher - usedCredit;

    return {
      subtotal,
      shipping,
      voucher: voucherAmount,
      usedCredit,
      total: total < 0 ? 0 : total
    };
  }
  
  isCartChanged(cart1: CartItemProps[], cart2: CartItemProps[]) {
    // compare length
    if (cart1.length !== cart2.length) {
      return true;
    }
    // compare total quantity
    const totalQty1: number = cart1.reduce((total: number, cartItem: CartItemProps) => total + cartItem.quantity, 0);
    const totalQty2: number = cart2.reduce((total: number, cartItem: CartItemProps) => total + cartItem.quantity, 0);

    return totalQty1 !== totalQty2;
  }

  calculateBillingItems({ shipping, voucher, cart }: { shipping: number, voucher: VoucherProps, cart: CartItemProps[] }): BillingItemsProps {
    const accountCredit = this.props.accountCredit;

    // assume shipping = 0, calculate billing items
    const billingItems: BillingItemsProps = this.calculate({
      accountCredit,
      shipping: 0,
      voucher,
      cart
    });

    // if total = 0 or shipping = 0 then return
    if (billingItems.total === 0 || shipping === 0) {
      return billingItems;
    }

    // otherwise re-calculate billing items with shipping fee
    return this.calculate({
      accountCredit,
      shipping,
      voucher,
      cart
    });
  }

  redeemCode(voucher: VoucherProps & { type: string }) {
    switch(voucher.type) {
      case 'giftcard':
        this.props.updateAccountCredit(this.props.accountCredit + voucher.amount);

        break;
      case 'voucher':
        this.updateVoucher(voucher);

        break;
    }
  }

  updateVoucher(voucher?: VoucherProps) {
    this.setState({
      billingItems: this.calculateBillingItems({
        shipping: this.state.billingItems.shipping,
        voucher,
        cart: this.props.cart
      }),
      voucher
    });
  }

  resolveVoucher(voucher: VoucherProps, { isCC }: PaymentMethodProps) {
    if (!voucher) {
      return;
    }

    if (this.state.billingItems.total < voucher.minimumPurchase) {
      return;
    }

    if (voucher.binRange && !isCC) {
      return;
    }

    return voucher;
  }

  updateBillingItems(paymentMethod: PaymentMethodProps) {
    const voucher = this.resolveVoucher(this.state.voucher, paymentMethod);

    this.setState({
      billingItems: this.calculateBillingItems({
        shipping: paymentMethod.shipping,
        voucher,
        cart: this.props.cart
      }),
      voucher,
      paymentMethod
    });
  }

  updateDeliveryNote(note: string) {
    const { shipping, billing } = this.state.address;
    this.setState({
      address: {
        shipping: {
          ...shipping,
          note
        },
        billing
      }
    });
  }

  componentWillReceiveProps({ cart, accountCredit }: CheckoutComponentProps) {
    // re-calculate billing items if cart changed
    if (this.isCartChanged(this.props.cart, cart)) {
      this.setState({
        billingItems: this.calculateBillingItems({
          shipping: this.state.billingItems.shipping,
          voucher: this.state.voucher,
          cart
        })
      });
    } 
    // or accountCredit changed
    else if (this.props.accountCredit !== accountCredit) {
      this.setState({
        billingItems: this.calculateBillingItems({
          shipping: this.state.billingItems.shipping,
          voucher: this.state.voucher,
          cart: this.props.cart
        })
      });
    }
  }

  render() {
    return (
      <CheckoutLayout className={styles.footerPaddingReset}>
        <Container>

          <div className={styles.checkoutContainer}>
            <Row>
              <div className={styles.colLg4}>
                {/* order summary */}
                <OrderSummary
                  isGuest={this.props.isGuest}
                  paymentMethod={this.state.paymentMethod}
                  numCartItems={this.props.cart.length}
                  voucher={this.state.voucher}
                  billingItems={this.state.billingItems}
                  redeemCode={this.redeemCode}
                  removeVoucher={this.updateVoucher} />

                {/* addresses */}
                <Address
                  disabledEdit={!!this.props.code}
                  address={this.state.address}
                  onChangeDeliveryNote={this.updateDeliveryNote} />

                {/* order details */}
                <OrderDetails
                  disabledEdit={!!this.props.code}
                  cart={this.props.cart} />
              </div>

              <Payment
                isGuest={this.props.isGuest}
                className={styles.colLg8}
                code={this.props.code}
                creditCards={this.props.creditCards}
                cardService={this.props.cardService}
                address={this.state.address}
                cart={this.props.cart}
                billingItems={this.state.billingItems}
                voucher={this.state.voucher}
                updateVoucher={this.updateVoucher}
                updateBillingItems={this.updateBillingItems}
                error={this.props.error}
              />
            </Row>
          </div>
        </Container>

        <BeginCheckout />
      </CheckoutLayout>
    );
  }
}

const Checkout = connect(
  (state, ownProps: any) => ({
    // if re-checkout, don't re-load cart from server
    cart: ownProps.code ? ownProps.cart : getCart(state),
    accountCredit: getAccountCredit(state),
    isGuest: isGuest(state)
  }), {
    updateAccountCredit
  }
)(translate(['common', 'orders', 'products', 'account', 'auth'])(CheckoutComponent));
