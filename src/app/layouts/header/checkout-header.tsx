import * as React from 'react';
import { SFC } from 'react';

import { Container, Link } from '../../common';

import * as styles from './header.scss';

const CheckoutHeader: SFC<{}> = (props) => {
  return (
      <div className={styles.header} id={styles.checkoutHeader}>
          <nav className={`clearfix ${styles.myNavbar} ${styles.navbarToggleableSm}`}>
              <Container className={styles.headerContainer}>
                  <Link className={`${styles.navbarBrand} checkout`} path="/">
                      <img src="/images/leflair-logo-black.png" />
                  </Link>

                  <div className={styles.contact}>
                    <a className={styles.navbarText} href="tel:19006710">
                      <i className="ic-ic-phone" /> 1900 6710
                    </a>
                  </div>
              </Container>
          </nav>
      </div>
  );
};

export default CheckoutHeader;
