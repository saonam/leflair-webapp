import * as React from 'react';
import { SFC } from 'react';

import { CheckoutLayout } from '../../../layouts';
import { Container, Row } from '../../../common';

import { CreateAddress } from './create-address';

export const CheckoutCreateAddress: SFC<any> = (props) => (
  <CheckoutLayout>
    <Container>
      <Row>
        <CreateAddress {...props} isCheckout={true} />
      </Row>
    </Container>
  </CheckoutLayout>
);
