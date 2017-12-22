import * as React from 'react';
import { translate } from 'react-i18next';

import { CheckoutLayout } from '../layouts';
import { Container } from '../common';

import * as styles from './auth.scss';

type AuthProps = {
  className?: string,
  children?: any,
  t?: Function
};

export default (title: string, children: any, className?: string) => translate('auth')((props: AuthProps) => (
  <CheckoutLayout className={styles.removePadding}>
    <Container>
      <div className={`${styles.colLg6} ${styles.colMd8} ${className || ''}`}>
        <h3 className={styles.title}>{props.t(title)}</h3>

        { children }
      </div>
    </Container>
  </CheckoutLayout>
));
