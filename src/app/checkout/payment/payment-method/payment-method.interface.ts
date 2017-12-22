import { AddressProps } from '../../../api/addresses';
import { CartItemProps } from '../../../api/cart';
import { VoucherProps } from '../../../api/vouchers';

export interface IPaymentMethod {
  selectedMethod: {
    method: string;
    value?: string;
    shipping: number;
  };
  updatePaymentMethod: Function;

  isGuest?: boolean;
  code: string;  // for re-checkout
  email?: string; // for guest-checkout
  address: {
    shipping: AddressProps;
    billing: AddressProps
  };
  cart: CartItemProps[];
  international: boolean;
  billingItems: {
    subtotal: number;
    shipping: number;
    voucher: number;
    usedCredit: number;
    total: number;
  };
  voucher: VoucherProps;

  submitted: boolean;
  handleError: Function;
  updateCart: Function;

  className?: string;
  t?: Function;
}
