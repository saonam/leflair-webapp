import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { history } from '../../../router';

import { Link, SignInLink } from '../../../common';

import { toggleNavbar } from '../../toggler';

import * as styles from './auth-buttons.scss';

class AuthButtons extends Component<any, any> {
  constructor(props: {className: string, t: Function}) {
    super(props);
  }

  render() {
    return (
      <div className={styles.auth}>
          <SignInLink className={`${styles.navLink} ${styles.btnSignIn}`} onClick={() => toggleNavbar(true)} />
          <Link className={`${styles.navLink} ${styles.btnRegister}`} path="/auth/register" onClick={() => toggleNavbar(true)}>
              {this.props.t('auth:REGISTER')}
          </Link>
      </div>
    );
  }
}

export default translate(['auth'])(AuthButtons);
