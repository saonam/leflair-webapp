import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { CheckoutLayout } from '../../layouts';
import { Container, Row, Link } from '../../common';
import { Addresses } from './addresses';

import { history } from '../../router';
import { isSignedIn } from '../../redux/user.redux';
import { AddressesProps, AddressProps, getAddresses, deleteAddress } from '../../api/addresses';


import * as styles from './addresses.scss';

export const checkoutAddressAction = async (params?: any, cookie?: any, store?: any) => {
  if (!isSignedIn(store.getState())) {
    return history.replace(`/cart/addresses/${params.type}/guest/edit`);
  }

  const addresses: AddressesProps = await getAddresses();

  return {
    component: <CheckoutAddresses addresses={addresses} {...params} />
  };
};

const CheckoutAddressesComponent: SFC<any> = (props) => (
  <CheckoutLayout>
    <Container>
      <Row>
        <Addresses {...props} isCheckout={true}>
          <div className={`${styles.checkoutActions} clearfix`}>
            <Link className="float-left" path="/cart/checkout">
              <i className={`${styles.icon} ic-ic-arrow-left`}></i>
              {props.t('checkout:BACK_TO_CHECKOUT')}
            </Link>

            <Link className="float-right" path={`/cart/addresses/${props.type === 'shipping' ? 'billing' : 'shipping'}`}>
              {props.t(`account:EDIT_${(props.type === 'shipping' ? 'billing' : 'shipping').toUpperCase()}_ADDRESS`)}
              <i className={`${styles.icon} ic-ic-arrow-right`}></i>
            </Link>
          </div>
        </Addresses>
      </Row>
    </Container>
  </CheckoutLayout>
);

export const CheckoutAddresses = translate(['account', 'checkout'])(CheckoutAddressesComponent);
