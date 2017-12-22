import * as React from 'react';
import { Component, SFC } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { Link } from '../../common';
import { AnAddress } from './an-address';
import { DeliveryNote } from './delivery-note';

import { AddressProps } from '../../api/addresses';

import * as styles from './address.scss';

const isSameAddress = (address: { shipping: AddressProps, billing: AddressProps }) => address.shipping.lastName === address.billing.lastName
&& address.shipping.firstName === address.billing.firstName
&& address.shipping.phone === address.billing.phone
&& address.shipping.address === address.billing.address
&& address.shipping.district.id === address.billing.district.id
&& address.shipping.city.id && address.billing.city.id;

type AddressComponentProps = {
  disabledEdit: boolean,
  address: {
    shipping: AddressProps,
    billing: AddressProps
  },
  onChangeDeliveryNote: Function,
  className?: string,
  t?: Function
};

type AddressComponentState = {
  showDeliveryNote: boolean
};

class AddressComponent extends Component<AddressComponentProps, AddressComponentState> {
  constructor(props: AddressComponentProps) {
    super(props);

    this.state = {
      showDeliveryNote: false
    };
  }

  render() {
    return (
      <div className={styles.card}>
        <div className={styles.cardBlock}>
          <AnAddress type="shipping" address={this.props.address.shipping} disabledEdit={this.props.disabledEdit}>
            {isSameAddress(this.props.address) && this.props.address.billing.companyName && this.props.address.billing.taxCode && <BillingInfo
              companyName={this.props.address.billing.companyName}
              taxCode={this.props.address.billing.taxCode}
            />}
          </AnAddress>
    
          {!isSameAddress(this.props.address) && <AnAddress className={styles.secondAddress} type="billing" address={this.props.address.billing} disabledEdit={this.props.disabledEdit}>
            {this.props.address.billing.companyName && this.props.address.billing.taxCode && <BillingInfo
              companyName={this.props.address.billing.companyName}
              taxCode={this.props.address.billing.taxCode}
            />}
          </AnAddress>}
    
          <div className={styles.deliveryNote}>
            {this.state.showDeliveryNote ? (
              <DeliveryNote note={this.props.address.shipping.note} onChange={this.props.onChangeDeliveryNote} />
            ) : (
              <div>
                <a className={styles.addDeliveryNote} href="javascript:void(0)" onClick={() => this.setState({
                  showDeliveryNote: true
                })}>{this.props.t('ADD_DELIVERY_NOTE')}</a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default translate('common')(AddressComponent);

type BillingInfoProps = {
  companyName: string,
  taxCode: string,
  t?: Function
};

const BillingInfoComponent: SFC<BillingInfoProps> = (props) => (
  <div>
    <span>{props.companyName}</span>
    <span className={styles.dotSeperator}>•</span>
    <span>{props.t('account:TAX_CODE')}: {props.taxCode}</span>
  </div>
);

const BillingInfo = translate('account')(BillingInfoComponent);
