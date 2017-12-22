import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { getUser } from '../../redux/user.redux';

import { Row, Button } from '../../common';

import * as styles from './subscription-form.scss';

import { subscribe } from '../../redux/user.redux';

const whiteText = '#fff';
const whiteText2 = '#D1D1D1';

type SubscriptionFormProps = {
  title?: string,
  title2?: string,
  subTitle?: string,
  thankYouSub?: string,
  className?: string,
  darkTheme?: boolean,
  subscribe?: Function,
  context?: string,
  user?: any
};

class SubscriptionForm extends Component<any, any> {
  constructor(props: SubscriptionFormProps) {
    super(props);

    this.state = {
      email: null,
      clicked: false,
      error: null,
      isInProgress: false
    };

    this.submit = this.submit.bind(this);
  }

  async submit(e: any) {
    e.preventDefault();

    this.setState({ isInProgress: true});

    if (this.state.email) {
      try {
        await this.props.subscribe(this.state.email, this.props.context);

        this.setState({
          clicked: true,
          error: null,
          isInProgress: false
        });
      } catch (error) {
        this.setState({
          error: error.message,
          isInProgress: false
        });
      }
    }
  }

  render() {
    return(
      <div className={`${styles.container} ${this.props.className || '' }`}>
          {(!this.state.clicked && !this.props.user.email) && <div className={styles.subscriptionBox}>
              <div className={styles.titleContainer}>
                  {this.props.title && <h3>{this.props.title || '' }</h3>}
                  {this.props.title2 && <h4 style={(this.props.darkTheme) ? {color: whiteText} : {}}>{this.props.title2 || '' }</h4>}
                  <p className={styles.subtext}>{this.props.subTitle ? this.props.subTitle : '' }</p>
              </div>
              <form className={styles.form} name="form" onSubmit= {this.submit}>
                  <Row>
                      <div className={`${styles.formGroup} ${styles.colMd8} ${styles.inputWrap}`}>
                          <input className={styles.formControl} type="email" name="email" placeholder="Your email..." required onChange={(e: any) => this.setState({email: e.target.value})} />
                      </div>
                      <div className={`${styles.formGroup} ${styles.colMd4} ${styles.buttonWrap}`}>
                          <Button
                            type="submit"
                            className={`${styles.btn} ${styles.btnPrimary}`}
                            isBusy={this.state.isInProgress}
                          >{this.props.t('subscription:SUBSCRIBE')} </Button>
                      </div>
                      {this.state.error && <p className={styles.error}>{this.state.error}</p>}
                  </Row>
              </form>
          </div> }

          {(this.state.clicked || this.props.user.email) && <div className={styles.thankYouBox}>
              <div className={styles.thankYou}>
                  <i className={`${styles.icon} ${styles.pulse} ic-ic-heart-fill`}></i>
                  <h3 className={styles.title} style={(this.props.darkTheme) ? {color: whiteText} : {}} >{this.props.t('subscription:THANK_YOU')}</h3>
                  <div className={styles.subTitle} style={(this.props.darkTheme) ? { color: whiteText2 } : {}}>{this.props.user.email ? this.props.t('subscription:THANK_YOU_SUB_2') : this.props.thankYouSub || '' }</div>
              </div>
          </div> }
      </div>
    );
  }
}

export default connect(
  (state) => ({
    user: getUser(state)
  }), {
    subscribe
  }
)(translate(['subscription'])(SubscriptionForm as any)) as any;
