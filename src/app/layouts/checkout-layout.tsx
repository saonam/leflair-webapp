import * as React from 'react';
import { SFC } from 'react';

import MasterLayout from './master-layout';
import { CheckoutHeader } from './header';
import { Cart } from './cart';
import { Backdrop } from './backdrop';

import * as styles from './default-layout.scss';

const CheckoutLayoutComponent: SFC<{ className?: string }> = (props) => (
  <MasterLayout>
    <div className={`${styles.container} ${props.className}`}>
      <Backdrop />

      <CheckoutHeader />

      { props.children }

      <Cart />
    </div>
  </MasterLayout>
);

export default CheckoutLayoutComponent;
