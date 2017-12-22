import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { CheckoutLayout } from '../../../layouts';
import { Container, Row, Link } from '../../../common';
import { history } from '../../../router';

import { AddressForm } from '../address-form';
import { ProcessIndicator } from '../../../checkout/process-indicator';

import * as styles from './create-address.scss';

import { createAddress } from '../../../redux/address.redux';

import { AddressProps, CityProps, getCities } from '../../../api/addresses';

type CreateGuestAddressProps = {
  createAddress: Function,
  isCheckout?: boolean,
  type: string,
  address: AddressProps,
  cities: CityProps[],
  className?: string,
  t?: Function
};

class CreateGuestAddressComponent extends Component<CreateGuestAddressProps, any> {
  constructor(props: CreateGuestAddressProps) {
    super(props);

    const variant = typeof window !== 'undefined' && !!(window as any).cxApi ? (window as any).cxApi.chooseVariation() : 0;

    this.state = {  
      address: props.address,
      error: null,
      isInProgress: false,
      variant
    };

    this.create = this.create.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  async create(address: AddressProps, duplicateBilling: boolean) {
    this.setState({
      isInProgress: true
    }, () => {
      this.props.createAddress(this.props.type, address, duplicateBilling);
      
      this.setState({
          isInProgress: false
      }, () => history.push('/cart/checkout'));
    });
  }

  cancel() {
    history.push('/cart/checkout');
  }

  render() {
    return (
        <CheckoutLayout>
            <Container>
                <Row>
                    <div className={`${styles.createAddress} ${this.props.isCheckout ? styles.colMd8 : styles.colMd6}`}>

                        {!!this.state.variant && this.props.isCheckout && <ProcessIndicator />}

                        <div className={styles.heading}>
                            <h3 className={styles.title}>{this.props.t(`account:NEW_${this.props.type.toUpperCase()}_ADDRESS`)}</h3>
                        </div>

                        <Row>
                            <div className={styles.colMd8}>
                            <AddressForm
                                isCheckout={this.props.isCheckout}
                                type={this.props.type}
                                address={this.state.address}
                                cities={this.props.cities}
                                error={this.state.error}
                                onSubmit={this.create}
                                onCancel={this.cancel}
                                isInProgress={this.state.isInProgress} />
                            </div>
                        </Row>
                    </div>
                </Row>
            </Container>
        </CheckoutLayout>
    )
  }
}

export const CreateGuestAddress = connect(null, {
  createAddress
})(translate(['account', 'checkout'])(CreateGuestAddressComponent) as any);
