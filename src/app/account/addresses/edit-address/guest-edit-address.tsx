import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { CheckoutLayout } from '../../../layouts';
import { Container, Row, Link } from '../../../common';
import { history } from '../../../router';

import { AddressForm } from '../address-form';

import * as styles from './edit-address.scss';

import { getAddress, updateAddress } from '../../../redux/address.redux';

import { AddressProps, CityProps, getCities } from '../../../api/addresses';

export const editGuestAddressAction = async (params?: any, cookie?: any, store?: any) => {
    const cities = await getCities();
    const address = getAddress(store.getState(), params.type);

    if (!address) {
        return history.push('/checkout/continue');
    }

    return {
        component: <EditGuestAddress
          isCheckout={true}
          type={params.type}
          address={address}
          cities={cities}
          updateAddress={(type: string, address: AddressProps, duplicateBilling: boolean) => store.dispatch(updateAddress(type, address, duplicateBilling))} />
    };
};

type EditGuestAddressProps = {
  updateAddress: Function,
  isCheckout?: boolean,
  type: string,
  address: AddressProps,
  cities: CityProps[],
  className?: string,
  t?: Function
};

class EditGuestAddressComponent extends Component<EditGuestAddressProps, any> {
    constructor(props: EditGuestAddressProps) {
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
        }, () => {
          this.props.updateAddress(this.props.type, address, duplicateBilling);
          
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
                    </Row>
                </Container>
            </CheckoutLayout>
        )
    }
}

export const EditGuestAddress = translate(['account', 'checkout'])(EditGuestAddressComponent);
