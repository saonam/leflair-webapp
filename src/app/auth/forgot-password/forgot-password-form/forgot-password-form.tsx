import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import * as qs from 'qs';

import { Container, Row, Link, TextInput, Button } from '../../../common';

import * as styles from './forgot-password-form.scss';

import { forgotPassword } from '../../../api/account';

class ForgotPasswordForm extends Component<any, any> {
    constructor(props: {t: Function}) {
        super(props);
        
        // not sure why the option `ignoreQueryPrefix: true` doesn't work so I add the `replace`.
        const { email }: { email: string } = qs.parse(typeof window !== 'undefined' ? location.search.replace('?', '') : '', { ignoreQueryPrefix: true });

        this.state = {
            email,
            success: null,
            error: null,
            isInProgress: false
        };

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeEmail(email: string) {
        this.setState({
          email
        });
    }

    async onSubmit(e: any) {
      e.preventDefault();

      this.setState({
        isInProgress: true
      });

      try {
        const data = await forgotPassword(this.state.email);
        this.setState({
          email: null,
          success: data.message,
          error: null,
          isInProgress: false
        });
      } catch(error) {
        this.setState({
          success: null,
          error: error.message,
          isInProgress: false
        });
      }
    }

    render() {
        return (
            <Container>
                <div className={styles.forgotPwContainer}>
                    <form className={styles.form} onSubmit={this.onSubmit} noValidate>
                        <TextInput 
                            label={this.props.t('auth:ENTER_EMAIL')}
                            placeholder=''
                            name='email'
                            type='email'
                            autoComplete='email'
                            value={this.state.email}
                            onFieldChanged={(e: any) => this.onChangeEmail(e.value)} />                            
                        {(this.state.success || this.state.error) && (
                          <div className={styles.formGroup}>
                            {this.state.success && (
                              <div className={`${styles.alert} ${styles.alertSuccess}`} role="alert">
                                {this.props.t(`auth:${this.state.success}`)}
                              </div>
                            )}
                            {this.state.error && (
                              <div className={`${styles.alert} ${styles.alertDanger}`} role="alert">
                                {this.props.t(`auth:${this.state.error}`)}
                              </div>
                            )}
                          </div>
                        )}
                        <div className={styles.formGroup}>
                            <Button
                              className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`}
                              type='submit'
                              value='submit'
                              isBusy={this.state.isInProgress}
                            >
                              {this.props.t('auth:REQUEST_NEW_PASSWORD')}
                            </Button>
                        </div>
                        <div className={styles.signIn}>
                            {this.props.t('auth:BACK_TO')} <Link path={`/auth/signin${this.state.email ? `?email=${this.state.email}` : ''}`}> {this.props.t('auth:SIGN_IN')}</Link>
                        </div>
                    </form>
                </div>
            </Container>
        );
    }

}

export default translate(['common', 'auth'])(ForgotPasswordForm);
