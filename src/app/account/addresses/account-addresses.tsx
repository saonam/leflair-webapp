import * as React from 'react';
import { SFC } from 'react';

import { DefaultLayout } from '../../layouts';
import { Container, Row } from '../../common';

import { AccountNav } from '../account-nav';
import { Addresses } from './addresses'

import * as styles from './addresses.scss';

export const AccountAddresses: SFC<any> = (props) => (
  <DefaultLayout>
    <Container>
      <Row>
        <div className={`${styles.colMd3} ${styles.navSection}`}>
          <AccountNav currentPage="MY_ADDRESSES_SHORT" />
        </div>

        <Addresses {...props} />
      </Row>
    </Container>
  </DefaultLayout>
);
