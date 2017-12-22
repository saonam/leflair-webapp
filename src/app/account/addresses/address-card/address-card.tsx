import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { Link, Button } from '../../../common';
import { history } from '../../../router';

import * as styles from './address-card.scss';

import { AddressProps, setDefault } from '../../../api/addresses';

const useAddress = async (address: AddressProps) => {
  try {
    await setDefault(address);

    history.push('/cart/checkout');
  } catch(error) {
    console.error(error);
  }
};

const AddressCard: SFC<{type: string, address: any, onDelete: Function, isCheckout?: boolean, className?: string, t?: Function}> = (props) => (
  <div className={props.className}>
      <div className={styles.card}>
          <div className={styles.cardBlock}>
              <div className={styles.heading}>
                  <span className={styles.fullName}>
                    {[props.address.lastName, props.address.firstName].join(' ')}
                  </span>
                  <div className={`float-right ${styles.actions}`}>
                    <Link className={styles.btnEdit} path={props.isCheckout ? `/cart/addresses/${props.type}/${props.address.id}/edit` : `/account/addresses/${props.type}/${props.address.id}/edit`}>{props.t('EDIT')}</Link>
                  </div>
              </div>

              <div>
                  <div className="full-address">
                    {[props.address.address, props.address.district.name, props.address.city.name].join(', ')}
                  </div>
                  <div className={styles.phone}>{props.address.phone}</div>
              </div>
              <div className={styles.actions}>
                  <a className={styles.btnDelete} href="javascript:void(0)" onClick={() => props.onDelete()}>{props.t('DELETE')}</a>
                  {props.isCheckout && (
                    <Button type="button" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnUseForCheckout}`} onClick={() => useAddress(props.address)}>
                      {props.t('account:USE_THIS_ADDRESS')}
                    </Button>
                  )}
              </div>
          </div>
      </div>
  </div>
);

export default translate(['common', 'account'])(AddressCard);
