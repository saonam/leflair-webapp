import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import onClickOutside from 'react-onclickoutside';

import { Container, Row, Link } from '../../../common';
import { history } from '../../../router';

import { toggleNavbar } from '../../toggler';

import * as styles from './my-account-dropdown.scss';

class MyAccountDropdown extends Component<any, any> {
  constructor(props: { accountCredit: Number, signOut: Function, className: string, t: Function }) {
    super(props);

    this.state = {
      show: false
    };

    this.toggle = this.toggle.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  handleClickOutside() {
    this.setState({
      show: false
    });
  }

  toggle(e: any) {
    this.setState({
      show: !this.state.show
    });
  }

  signOut() {
    this.props.signOut();

    const paths = location.pathname.split('/');
    if (['account', 'cart'].indexOf(paths[0])) {
      history.push('/');
    };

    toggleNavbar(true);
  }

  render() {
    return (
      <div className={`${styles.dropdown} ${this.state.show ? styles.show : ''}`}>
        <a href="javascript:void(0)" className={`${styles.navLink} ${styles.dropdownToggle}`} onClick={this.toggle}>{this.props.t('account:MY_ACCOUNT')}</a>
        <div className={styles.dropdownMenu}>
          <Link className={styles.dropdownItem} path="/account/settings" onClick={() => toggleNavbar(true)}>
            {this.props.t('account:MY_SETTINGS')}
            <div className={styles.extraDesc}>{this.props.t('account:CREDIT')} {this.props.accountCredit}</div>
          </Link>
          <Link className={styles.dropdownItem} path="/account/orders" onClick={() => toggleNavbar(true)}>
            {this.props.t('account:MY_ORDERS')}
          </Link>
          <Link className={styles.dropdownItem} path="/account/addresses" onClick={() => toggleNavbar(true)}>
            {this.props.t('account:MY_ADDRESSES')}
          </Link>
          <Link className={styles.dropdownItem} path="/account/cards" onClick={() => toggleNavbar(true)}>
            {this.props.t('account:MY_CARDS')}
          </Link>
          <div className={styles.dropdownDivider}></div>
          <a className={styles.dropdownItem} href="javascript:void(0)" onClick={this.signOut}>
            {this.props.t('account:SIGN_OUT')}
          </a>
        </div>
      </div>
    )
  }
}

export default translate('account')(onClickOutside(MyAccountDropdown));
