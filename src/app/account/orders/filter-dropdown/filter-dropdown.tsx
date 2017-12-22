import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import onClickOutside from 'react-onclickoutside';

import { Button } from '../../../common';

import * as styles from './filter-dropdown.scss';

const filterOptions = ['ALL_ORDERS', 'OPEN_ORDERS', 'PAST_ORDERS'];

class FilterDropdown extends Component<any, any> {
  constructor(props: {currentSelected: string, onSelect: Function, className?: string, t?: Function}) {
    super(props);

    this.state = {
      show: false
    };

    this.toggle = this.toggle.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  handleClickOutside() {
    this.setState({
      show: false
    });
  }

  toggle() {
    this.setState({
      show: !this.state.show
    });
  }

  onSelect(option: string) {
    this.toggle();
    this.props.onSelect(option);
  }

  render() {
    return (
      <div className={`d-inline-block ${styles.ordersDropdown} ${styles.dropdown} ${this.state.show ? styles.show : ''}`}>
        <Button type="button" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnDropdown}`} onClick={this.toggle}>
          {this.props.t(`orders:${this.props.currentSelected}`)}
          <i className={`${styles.icon} ic-ic-arrow-down`}></i>
        </Button>

        <ul className={styles.dropdownMenu}>
          {filterOptions.map((option: string) => (
            <li key={option} role="menuitem">
              <a className={`${styles.dropdownItem} ${option === this.props.currentSelected ? styles.active : ''}`} href="javascript:void(0)" onClick={() => this.onSelect(option)}>
                {this.props.t(`orders:${option}`)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default translate('orders')(onClickOutside(FilterDropdown));