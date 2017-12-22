import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import onClickOutside from 'react-onclickoutside';
import { connect } from 'react-redux';

import { Link } from '../../../common';
import { toggleNavbar } from '../../toggler';
import { getCurrentLang, updateLang, isSignedIn, DEFAULT_LANG } from '../../../redux/user.redux';

import * as styles from './language-dropdown.scss';

const languages = [{
  display: 'Tiếng Việt',
  value: 'vn'
},{
  display: 'English',
  value: 'en'
}];

type LanguageDropdownProps = {
  isSignedIn: boolean,
  currentLang: string,
  updateLang: Function,
  onChangeLang?: Function,
  className?: string,
  t?: Function
};

type LanguageDropdownState = {
  show: boolean
};

class LanguageDropdown extends Component<LanguageDropdownProps, LanguageDropdownState> {
  constructor(props: any) {
    super(props);

    this.state = {
      show: false
    };

    this.toggle = this.toggle.bind(this);
    this.change = this.change.bind(this);
  }

  handleClickOutside() {
    this.setState({
      show: false
    });
  }

  toggle(e?: any) {
    this.setState({
      show: !this.state.show
    });
  }

  change(lang: string) {
    if (lang !== this.props.currentLang) {
      this.props.updateLang(lang, this.props.isSignedIn);

      // callback
      if (this.props.onChangeLang) {
        this.props.onChangeLang(lang);
      }
    }

    // toggle dropdown
    this.toggle();
    // toggle navbar on mobile
    toggleNavbar(true);
  }

  render() {
    return (
      <div className={`${this.props.className} ${styles.dropdown} ${styles.dropdownSection} ${this.state.show ? styles.show : ''}`}>
          <a className={`text-uppercase ${styles.navLink} ${styles.dropdownToggle}`} href="javascript:void(0)" onClick={this.toggle}>
            {this.props.currentLang || DEFAULT_LANG}
          </a>
          <ul className={styles.dropdownMenu}>
            {languages.map((lang: any, index: number) => (
              <li key={index} className={`${lang.value === this.props.currentLang ? styles.active : ''}`}>
                <a className={styles.dropdownItem} href="javascript:void(0)" onClick={() => this.change(lang.value)}>{lang.display} ({lang.value})</a>
              </li>
            ))}
          </ul>
      </div>
    )
  }
}

export default connect(
state => ({
    isSignedIn: isSignedIn(state),
    currentLang: getCurrentLang(state),
}), {
    updateLang
})(translate('common')(onClickOutside(LanguageDropdown)));
