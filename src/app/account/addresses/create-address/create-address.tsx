import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Row, Link } from '../../../common';
import { history } from '../../../router';

import { AddressForm } from '../address-form';

import * as styles from './create-address.scss';

import { AddressProps, CityProps, getCities, createAddress } from '../../../api/addresses';

export const createAddressAction = (Layout: any) => async (params?: any) => {
  const address: AddressProps = {
    id: undefined,
    firstName: '',
    lastName: '',
    address: '',
    district: null,
    city: null,
    phone: '',
    companyName: params.type === 'billing' ? '' : undefined,
    taxCode: params.type === 'billing' ? '' : undefined,
    default: true
  };
  const cities = await getCities();

  return {
    component: <Layout type={params.type} address={address} cities={cities} />
  };
};

class CreateAddressComponent extends Component<any, any> {
  constructor(props: { isCheckout?: boolean, type: string, address: AddressProps, cities: CityProps[], className?: string, t?: Function }) {
    super(props);

    this.state = {  
      address: props.address,
      error: null,
      isInProgress: false
    };

    this.create = this.create.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  async create(address: AddressProps, duplicateBilling: boolean) {
    this.setState({
      isInProgress: true
    });

    try {
      await createAddress(this.props.type, address, duplicateBilling);

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
    history.push(this.props.isCheckout ? `/cart/addresses/${this.props.type}` : '/account/addresses');
  }

  render() {
    return (
      <div className={`${styles.createAddress} ${this.props.isCheckout ? styles.colMd8 : styles.colMd6}`}>

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
    )
  }
}

export const CreateAddress = translate(['account', 'checkout'])(CreateAddressComponent);
