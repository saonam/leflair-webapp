import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { Link } from '../../../common';
import { AddressProps } from '../../../api/addresses';

import * as styles from './an-address.scss';

type AnAddressProps = {
  disabledEdit: boolean,
  type: string,
  address: AddressProps,
  className?: string,
  children?: any,
  t?: Function
};

const AnAddress: SFC<AnAddressProps> = (props) => (
  <div className={`${props.className || ''} ${styles.address}`}>
    <h4 className={styles.cardTitle}>
        <span>{props.t(`orders:${props.type === 'shipping' ? 'SHIP_TO' : 'BILL_TO'}`)}</span>
        {!props.disabledEdit && <div className={styles.actions}>
            <Link path={`/cart/addresses/${props.type}`}>{props.t('EDIT')}</Link>
        </div>}
    </h4>
    {props.address && <div>
        <div>
            <span>{[props.address.lastName, props.address.firstName].join(' ')}</span>
            <span className={styles.dotSeperator}>•</span>
            <span>{props.address.phone}</span>
        </div>
        <div>
            {[props.address.address, props.address.district.name, props.address.city.name].join(', ')}
        </div>

        {props.children}
    </div>}
  </div>
);

export default translate(['common', 'orders'])(AnAddress);
