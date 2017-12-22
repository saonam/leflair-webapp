import * as React from 'react';
import { Component } from 'react';

import { history } from '../../../router';
import { IPaymentMethod } from './payment-method.interface';
import { checkout, reCheckout } from '../../../api/checkout';
import * as Aimtell from '../../../api/aimtell';
import { CartItemProps } from '../../../api/cart';
import { AddressProps } from '../../../api/addresses';

import { CreditCardProps } from '../../../api/credit-cards';
import { VoucherProps } from '../../../api/vouchers';

export type PaymentMethodProps = {
  method: string,
  value: string,
  shipping: number,
  isCC: boolean,
  first4?: number,
  first6?: number
};

export type CreditCardProps = {
  cardName?: string,
  cardNumber: string,
  type: string,
  expiry: { month: number, year: number },
  cvv: number
};

type CheckoutData = {
  code: string,
  email?: string,
  address: { shipping: AddressProps, billing: AddressProps},
  cart: { id: string, quantity: number, salePrice: number }[],
  shipping: number,
  accountCredit: number,
  voucher?: string,
  method: string,
  methodData?: any,
  saveCard?: boolean,
  language?: string
};

export type CheckoutResponse = {
  code: string,
  creditCard?: CreditCardProps,
  data?: any
};

class PaymentMethod<T extends IPaymentMethod, U extends { [key: string]: any }> extends Component<T, U> {
  protected method: string;
  protected value?: string;
  protected shipping: number;
  protected isCC?: boolean;
  protected first4?: number;
  protected first6?: number;
  
  constructor(props: T) {
    super(props);
    
    this.isSelected = this.isSelected.bind(this);
    this.select = this.select.bind(this);
  }

  changeField(field: string, value: any, cb = () => {}) {
    this.setState({
      [field]: value
    }, cb);
  }

  isValid() {
    return this.props.billingItems.total > 0 && !this.props.international;
  }

  isSelected() {
    if (!this.props.selectedMethod) {
      return false;
    }

    return this.props.selectedMethod.method === this.method && (['CC', 'STRIPE'].indexOf(this.props.selectedMethod.method) === -1 || this.props.selectedMethod.value === this.value);
  }

  select() {
    this.props.updatePaymentMethod({
      method: this.method,
      value: this.value || undefined,
      shipping: this.shipping,
      isCC: this.isCC,
      first4: this.first4,
      first6: this.first6
    });
  }

  resolveCart(cart: CartItemProps[]) {
    return cart.map(({ id, quantity, salePrice }: CartItemProps) => ({ id, quantity, salePrice }));
  }

  resolveVoucher(voucher: VoucherProps) {
    return voucher && voucher.id || undefined;
  }

  async submit() {
    const { code, email, address, cart, billingItems, voucher }: IPaymentMethod = this.props;

    await this.checkout({
      code,
      email,
      address,
      cart: this.resolveCart(cart),
      shipping: this.shipping,
      accountCredit: billingItems.usedCredit,
      voucher: this.resolveVoucher(voucher),
      method: this.method
    }, (res: CheckoutResponse) => {
      history.push(`/cart/checkout/thank-you/${res.code}`);
    });
  }

  async checkout({ code, ...checkoutData }: CheckoutData, cb: Function) {
    try {
      const res: CheckoutResponse = code ? await reCheckout(code, checkoutData) : await checkout(checkoutData);

      Aimtell.finishCheckout();

      // clear cart
      this.props.updateCart([]);

      cb(res);
    } catch (error) {
      if (typeof error.message === 'string') {
        this.props.handleError({
          message: error.message,
          data: error.data
        });
      }

      else if (Array.isArray(error.message)) {
        this.props.handleError({
          message: error.message.join(', '),
          data: error.data
        });
      }

      else {
        this.props.handleError({
          message: 'CHECKOUT_ERROR',
          data: error.data
        });
      }
    }
  }

  componentDidMount() {
    // select a default method
    if (!this.props.selectedMethod && this.isValid()) {
      this.select();
    }
  }

  async componentDidUpdate(prevProps: T) {
    // after removing international products, the selectedMethod is null, then select a new method
    if (!this.props.selectedMethod && this.isValid()) {
      this.select();
    }
    // after clicking the Place Order button
    else if (this.isSelected() && this.props.submitted && !prevProps.submitted) {
      await this.submit();
    }
  }
}

export default PaymentMethod;
