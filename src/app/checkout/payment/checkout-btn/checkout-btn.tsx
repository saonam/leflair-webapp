import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { Button } from '../../../common';

import { isGuest } from '../../../redux/user.redux';

import * as styles from './checkout-btn.scss';

type CheckoutBtnProps = {
  isGuest: boolean,
  isInProgress: boolean,
  className?: string,
  t?: Function
};

class CheckoutBtn extends Component<CheckoutBtnProps, any> {
  constructor(props: CheckoutBtnProps) {
    super(props);

    this.state = {
      floatCheckoutBtnHidden: false
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll() {
    const dest = document.getElementById('btn-checkout-mobile');

    if (dest.getBoundingClientRect().top <= window.innerHeight) {
      this.setState ({
        floatCheckoutBtnHidden: true
      });
    } else {
      this.setState ({
        floatCheckoutBtnHidden: false
      });
    }
  }

  render() {
    return (
      <div>
        <div className={`${styles.checkout} ${this.props.className || ''}`} id="btn-checkout-mobile">
          <div className={`${styles.actions} text-center`}>
            <Button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary} ${styles.btnCheckout}`}
              isBusy={this.props.isInProgress}
            >
              <i className={`${styles.icon} ic-ic-lock`}></i>
              {this.props.t('orders:PLACE_ORDER')}
            </Button>

            {this.props.isGuest && <div className={styles.policy}>
              <span>{this.props.t('auth:SIGN_IN_POLICY')}</span>
              <a href="https://support.leflair.vn/hc/vi/articles/214857097-%C4%90i%E1%BB%81u-kho%E1%BA%A3n-v%C3%A0-quy-%C4%91%E1%BB%8Bnh-chung"

              target="_blank"> {this.props.t('auth:THE_LEFLAIR_POLICIES')} </a>
              {this.props.t('auth:LEFLAIR_NAME')}
            </div> }
          </div>
        </div>

        {/* sticky place order button on mobile */}
        <div className={`${styles.btnFloatCheckout} ${this.state.floatCheckoutBtnHidden ? styles.hide : '' }`} id="btn-float-checkout">
          <div className={styles.checkout}>
            <div className={`${styles.actions} text-center`}>
              <Button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary}`} 
                isBusy={this.props.isInProgress}>
                <i className={`${styles.icon} ic-ic-lock`}></i>
                {this.props.t('orders:PLACE_ORDER')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}

export default connect((state: any) => ({
  isGuest: isGuest(state)
}), {})(translate(['auth', 'orders'])(CheckoutBtn)) as any;
