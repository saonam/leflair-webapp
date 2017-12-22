import * as React from 'react';
import { SFC } from 'react';

import { DefaultLayout } from '../../../layouts';
import { Container, Row } from '../../../common';

import { AccountNav } from '../../account-nav';
import { CreateAddress } from './create-address'

import * as styles from '../addresses.scss';

export const AccountCreateAddress: SFC<any> = (props) => (
  <DefaultLayout>
    <Container>
      <Row>
        <div className={`${styles.colMd3} ${styles.navSection}`}>
          <AccountNav currentPage="MY_ADDRESSES" />
        </div>

        <CreateAddress {...props} />
      </Row>
    </Container>
  </DefaultLayout>
);
