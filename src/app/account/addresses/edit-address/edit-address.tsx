import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Row, Link } from '../../../common';
import { history } from '../../../router';

import { AddressForm } from '../address-form';

import * as styles from './edit-address.scss';

import { AddressProps, CityProps, getAddress, updateAddress, getCities } from '../../../api/addresses';

export const editAddressAction = (Layout: any) => async (params?: any, cookie?: any) => {
  const [ address, cities ] = await Promise.all([
    getAddress(params.addressId, cookie),
    getCities()
  ]);

  return {
    component: <Layout type={params.type} address={address} cities={cities} />
  };
};

class EditAddressComponent extends Component<any, any> {
  constructor(props: { isCheckout?: boolean, type: string, address: AddressProps, cities: CityProps[], className?: string, t?: Function }) {
    super(props);

    this.state = {
      address: props.address,
      error: null,
      isInProgress: false
    };

    this.update = this.update.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  async update(address: AddressProps, duplicateBilling: boolean) {
    this.setState({
      isInProgress: true
    });

    try {
      await updateAddress(this.props.type, address, duplicateBilling);

      history.push(this.props.isCheckout ? '/cart/checkout' : '/account/addresses');
    } catch(error) {
      this.setState({
        address,
        error: error.message,
        isInProgress: false
      });
    }
  }

  cancel() {
    history.push(this.props.isCheckout ? `/cart/addresses/${this.props.type}` : `/account/addresses`);
  }

  render() {
    return (
      <div className={`${styles.editAddress} ${this.props.isCheckout ? styles.colMd8 : styles.colMd6}`}>
          <div className={styles.heading}>
            <h3 className={styles.title}>{this.props.t(`account:EDIT_${this.props.type.toUpperCase()}_ADDRESS`)}</h3>
          </div>

          <Row>
            <div className={styles.colMd8}>
              <AddressForm
                isCheckout={this.props.isCheckout}
                type={this.props.type}
                address={this.state.address}
                cities={this.props.cities}
                error={this.state.error}
                onSubmit={this.update}
                onCancel={this.cancel}
                isInProgress={this.state.isInProgress} />
            </div>
          </Row>
      </div>
    )
  }
}

export const EditAddress = translate(['account', 'checkout'])(EditAddressComponent);
