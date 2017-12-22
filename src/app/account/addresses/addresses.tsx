import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Row, Link } from '../../common';
import { history } from '../../router';

import { AccountNav } from '../account-nav';
import { AddressCard } from './address-card';

import * as styles from './addresses.scss';

import { AddressesProps, AddressProps, getAddresses, deleteAddress } from '../../api/addresses';

export const addressesAction = (Layout: any) => async (params?: any, cookie?: any) => {
  const addresses: AddressesProps = await getAddresses(cookie);

  return {
    component: <Layout addresses={addresses} {...params} />
  };
};

class AddressesComponent extends Component<any, any> {
  constructor(props: { addresses: AddressesProps, isCheckout?: boolean, type?: string, className?: string, children?: any, t?: Function }) {
    super(props);

    this.state = {
      addresses: props.addresses
    };

    this.onDelete = this.onDelete.bind(this);
  }

  async onDelete(type: string, address: AddressProps) {
    // confirm deletion
    if (confirm(this.props.t('account:CONFIRM_DELETE_ADDRESS', {
      value: [address.address, address.district.name, address.city.name].join(', ')
    }))) {
      try {
        await deleteAddress(address.id);
        const { shipping, billing } = this.state.addresses;

        this.setState({
          addresses: {
            shipping: type === 'shipping' ? shipping.filter((add: AddressProps) => add.id !== address.id) : shipping,
            billing: type === 'billing' ? billing.filter((add: AddressProps) => add.id !== address.id) : billing
          }
        });
      } catch(error) {
        console.error(error);
      }
    }
  }

  render() {
    return (
      <div className={`${styles.colMd9} ${styles.col12}`}>
        <div className={styles.container}>
          <h3 className={styles.pageTitle}>{this.props.t('account:MY_ADDRESSES')}</h3>

          {['shipping', 'billing'].map((type: string, index: number) => (!this.props.isCheckout || this.props.type === type) && (
            <div key={index} className={(styles as any)[type]}>
              <div className={`${styles.heading} clearfix`}>
                <h4 className={styles.title}>{this.props.t(`account:${type.toUpperCase()}_ADDRESS`)}</h4>
              </div>

              <Row>
                {this.state.addresses[type].map((address: AddressProps, index: number) => (
                  <AddressCard
                    key={index}
                    className={`${styles.address} ${styles.colMd6} ${styles.colLg4}`}
                    type={type}
                    address={address}
                    onDelete={() => this.onDelete(type, address)}
                    isCheckout={this.props.isCheckout} />
                ))}

                <div className={`${styles.address} ${styles.colMd6} ${styles.colLg4}`}>
                  <Link className={`${styles.card} ${styles.newAddress}`} path={this.props.isCheckout ? `/cart/addresses/${type}/create` : `/account/addresses/${type}/create`}>
                    <div className={styles.cardBlock}>
                      <i className="ic-ic-plus"></i> {this.props.t(`account:ADD_${type.toUpperCase()}_ADDRESS`)}
                    </div>
                  </Link>
                </div>
              </Row>
            </div>
          ))}

          {this.props.children}
        </div>
      </div>
    )
  }
}

export const Addresses = translate(['account', 'checkout'])(AddressesComponent);
