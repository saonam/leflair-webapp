import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import onClickOutside from 'react-onclickoutside';

import { Button } from '../../common';

import * as styles from './sort.scss';

class SortComponent extends Component<any, any> {
  constructor(props: {data: string[], currentSelected: string, onSelect: Function, t: Function}) {
    super(props);

    this.state = {
      show: false
    };

    this.show = this.show.bind(this);
    this.select = this.select.bind(this);
  }

  handleClickOutside() {
    this.setState({
      show: false
    });
  }

  show() {
    this.setState({
      show: !this.state.show
    });
  }

  select(option: string) {
    this.show();
    this.props.onSelect(option);
  }

  render() {
    return (
      <div className={`float-right ${styles.dropdown} ${this.state.show ? styles.show : ''}`}>
        <Button type="button" className={`${styles.btn} ${styles.btnSecondary} ${styles.dropdownToggle}`} onClick={this.show}>
          <span className={styles.btnText}> {this.props.t(`common:SORT_BY`)} {this.props.t(`common:${this.props.currentSelected || 'SORT_BY'}`)}</span>
          <i className={`ic-ic-arrow-down ${styles.icon}`}></i>
        </Button>
        <ul className={`${styles.dropdownMenuRight} ${styles.dropdownMenu}`} role="menu" aria-labelledby="single-button">
          {this.props.data.map((option: string, index: number) => (
            <li role="menuitem" key={index}>
              <a
                href="javascript:void(0)"
                className={`${styles.dropdownItem} ${option === this.props.currentSelected ? styles.active : ''}`}
                onClick={() => this.select(option)}
              >{this.props.t(`common:${option}`)}</a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default translate(['common'])(onClickOutside(SortComponent));
