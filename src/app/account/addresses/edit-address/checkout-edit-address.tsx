import * as React from 'react';
import { SFC } from 'react';

import { CheckoutLayout } from '../../../layouts';
import { Container, Row } from '../../../common';

import { EditAddress } from './edit-address';

export const CheckoutEditAddress: SFC<any> = (props) => (
  <CheckoutLayout>
    <Container>
      <Row>
        <EditAddress {...props} isCheckout={true} />
      </Row>
    </Container>
  </CheckoutLayout>
);
