import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Container, Row, Link, TextInput, Button } from '../../../common';
import { history } from '../../../router';

import * as styles from './reset-password-form.scss';

import { resetPassword } from '../../../api/account';

class ResetPasswordForm extends Component<any, any> {
  constructor(props: {token: string, className?: string, t?: Function}) {
    super(props);

    this.state = {
      password: null,
      error: null,
      success: null,
      isInProgress: false
    };

    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
  }

  onChangePassword(password: string) {
    this.setState({
      password,
      error: null
    });
  }

  validatePassword(password: string) {
    return password && password.length && password.length >= 7;
  }

  async onSubmit(e: any) {
    e.preventDefault();

    if (this.validatePassword(this.state.password)) {
      this.setState({
        isInProgress: true
      });

      try {
        const res = await resetPassword(this.state.password, this.props.token);

        this.setState({
          password: null,
          error: null,
          success: res.message,
          isInProgress: false
        });
      } catch (error) {
        this.setState({
          password: null,
          error: error.message,
          isInProgress: false
        });
      }
    } else {
      this.setState({
        error: 'RESET_INVALID_PASSWORD'
      });
    }
    
  }

    render() {
        return (
            <Container>
                <div className={styles.forgotPwContainer}>
                    {!this.state.success ? <form className={styles.form} onSubmit={this.onSubmit}>
                        <TextInput
                            label={this.props.t('account:NEW_PASSWORD')}
                            placeholder={this.props.t('account:NEW_PASSWORD')}
                            type='password'
                            onFieldChanged={(e: any) => {this.onChangePassword(e.value)}} required />                            
                        {(this.state.error) && (
                          <div className={styles.formGroup}>
                            <div className={`${styles.alert} ${styles.alertDanger}`} role="alert">
                              {this.props.t(`auth:${this.state.error}`)}
                            </div>
                          </div>
                        )}
                        <div className={styles.formGroup}>
                            <Button
                              className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`}
                              type='submit'
                              isBusy={this.state.isInProgress}
                            >{this.props.t('auth:RESET_PASSWORD')}</Button>
                        </div>
                    </form> : (
                      <div className={styles.success}>
                        <p>{this.props.t(this.state.success)}</p>
                        <Link className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`} path="/auth/signin">{this.props.t('auth:SIGN_IN')}</Link>
                      </div>
                    )}
                </div>
            </Container>
        );
    }

}

export default translate(['common', 'auth'])(ResetPasswordForm);

