import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import * as qs from 'qs';

import { Container, Row, Link, TextInput, Button } from '../../../common';
import { history } from '../../../router';
import { register } from '../../../redux/user.redux';
import { setAlert } from '../../../redux/alert.redux';
import { isValidEmail } from '../../sign-in-form/sign-in-form';

import * as styles from './register-form.scss';

import { signInByFacebookUrl } from '../../../api/account';
import * as FacebookPixel from '../../../api/facebook-pixel';

interface RegisterFormState {
    email: string;
    password: string;
    gender: string;
    language: string;
    error: string;
    isInProgress: boolean;
}

const DEFAULT_LANG = 'en';

class RegisterForm extends Component<any, RegisterFormState> {
    constructor(props: {register: Function, t?: Function }) {
      super(props);
      
      // not sure why the option `ignoreQueryPrefix: true` doesn't work so I add the `replace`.
      const { email }: { email: string } = qs.parse(typeof window !== 'undefined' ? location.search.replace('?', '') : '', { ignoreQueryPrefix: true });

      this.state = {
          email,
          password: null,
          gender: 'F',
          language: DEFAULT_LANG,
          error: null,
          isInProgress: false,
      };

      this.handleFieldChanged = this.handleFieldChanged.bind(this);
      this.onChangeGender = this.onChangeGender.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
        this.validateInputs = this.validateInputs.bind(this);
    }

    handleFieldChanged(fieldName: string) {
      return (e: any) => this.setState({
          [fieldName]: e.value
      } as RegisterFormState);
    }

    onChangeGender(gender: string) {
      this.setState({
        gender
      });
    }

    validateInputs(): boolean {
        if (!isValidEmail(this.state.email)) {
            this.setState({
                password: null,
                error: 'REGISTER_INVALID_EMAIL',
            });
            return false;
        } else if (!this.state.password || this.state.password.length <= 6) {
            this.setState({
                password: null,
                error: 'REGISTER_INVALID_PASSWORD'
            })
            return false;
        }

        return true;
    }

    onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (this.validateInputs()) {
            this.setState({
                isInProgress: true
            });

            this.props.register({
                email: this.state.email,
                password: this.state.password,
                gender: this.state.gender,
                language: this.state.language
            }, () => {
                this.props.setAlert({
                    isVisible: true,
                    message: 'WELCOME_SIGNUP',
                    timeOut: 4000,
                    type: 'success'
                });
                history.push('/');
            }, (error: any) => {
                this.setState({
                    password: null,
                    error: error.message,
                    isInProgress: false
                });
            });
        }
    }

    render() {
        return (
            <Container>
                <div className={styles.registerContainer}>
                    <form onSubmit={this.onSubmit} noValidate className={styles.form}>
                        <div className={styles.facebookRegister}>
                            <a href={signInByFacebookUrl} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock} ${styles.btnFacebookRegister}`}>
                                <i className="ic-facebook"></i>
                                {this.props.t('auth:REGISTER_WITH_FACEBOOK')}
                            </a>
                        </div>
                        <div className={styles.separator}>
                            <hr/>
                            <span className={styles.orText}>{this.props.t('common:OR')}</span>
                        </div>

                        <TextInput 
                            label={this.props.t('account:EMAIL')}
                            placeholder=''
                            type='email'
                            name='email'
                            autoComplete='email'
                            value={this.state.email}
                            onFieldChanged={this.handleFieldChanged('email')} />
                        <TextInput
                            label={this.props.t('account:CREATE_PASSWORD')}
                            placeholder=''
                            type='password'
                            onFieldChanged={this.handleFieldChanged('password')} />
                        <div className={`${styles.formGroup} ${styles.sex}`}>
                            <div className={styles.btnGroup}>
                                <label className={`${styles.btnGender} ${styles.btn} ${styles.btnSecondary} ${this.state.gender === 'F' ? styles.active : ''}`} onClick={() => this.onChangeGender('F')}>{this.props.t('common:FEMALE')}</label>
                                <label className={`${styles.btnGender} ${styles.btn} ${styles.btnSecondary} ${this.state.gender === 'M' ? styles.active : ''}`} onClick={() => this.onChangeGender('M')}>{this.props.t('common:MALE')}</label>
                            </div>
                        </div>
                        
                        {this.state.error && (
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
                                value='submit' 
                                isBusy={this.state.isInProgress}
                            >
                                {this.props.t('auth:CREATE_NEW_ACCOUNT')}
                            </Button>
                        </div>
                        <div className={styles.policy}>
                            <span>{this.props.t('auth:SIGN_IN_POLICY')}</span>
                            <a href="https://support.leflair.vn/hc/vi/articles/214857097-%C4%90i%E1%BB%81u-kho%E1%BA%A3n-v%C3%A0-quy-%C4%91%E1%BB%8Bnh-chung"
                                target="_blank"> {this.props.t('auth:THE_LEFLAIR_POLICIES')}</a> {this.props.t('auth:LEFLAIR_NAME')}
                        </div>
                        <div className={styles.signIn}>
                            {this.props.t('auth:ALREADY_A_MEMBER')} <Link path={`/auth/signin${this.state.email ? `?email=${this.state.email}` : ''}`}> {this.props.t('auth:SIGN_IN')}</Link>
                        </div>
                    </form>
                </div>
            </Container>
        );
    }
}

const ConnectedRegisterForm = connect(
  () => ({}), {
  register,
  setAlert
})(RegisterForm);

export default translate(['common', 'auth', 'account'])(ConnectedRegisterForm);
