import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { CheckoutLayout } from '../../layouts';
import { Container, Button, TextInput, Link } from '../../common';
import { signIn } from '../../redux/user.redux';

import * as styles from './sign-in-form.scss';

export const LABEL_SIGN_IN = 'SIGN_IN';
export const LABEL_SIGN_IN_AND_CHECKOUT = 'SIGN_IN_AND_CHECKOUT';

export const isValidEmail = (email: string) => /.+\@.+\..+/.test(email)

class SignInForm extends Component<{ t: Function, onSuccess?: Function, onFailure?: Function, onChange?: Function, signIn: Function, label?: string }, { email: string, password: string, error: string, isInProgress: boolean }> {
    constructor(props: any) {
      super(props);

        this.state = {
            email: '',
            password: '',
            error: '',
            isInProgress: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleFieldChange(e: any, field: string) {
        this.props.onChange && this.props.onChange(field, e.value);

        this.setState({
            [field]: e.value,
            error: ''
        } as any);
    }
    
    handleSubmit(e: any) {
        e.preventDefault();

        if (!this.validateState()) {
            this.setState({
                error: this.props.t('auth:VALIDATE_FIELDS_MISSING')
            });
            return;
        }

        this.setState({ isInProgress: true });

        this.props.signIn(this.state.email, this.state.password, () => {
            this.props.onSuccess && this.props.onSuccess();

            this.setState({
                error: '',
                isInProgress: false,
            });
        }, (error: { message: string }) => {
            this.props.onFailure && this.props.onFailure(error);

            this.setState({
                error: error.message,
                isInProgress: false,
            });
        });
    }

    validateState() {
        return isValidEmail(this.state.email) && this.state.password;
    }
    
    render() {
        return (
            <form onSubmit={this.handleSubmit} noValidate>
                <TextInput 
                    label={this.props.t('account:EMAIL')}
                    placeholder=''
                    type='email'
                    name='email'
                    autoComplete='email'
                    value={this.state.email}
                    onFieldChanged={(e: any) => this.handleFieldChange(e, 'email')} />
                <div className={styles.forgotPasswordWrap}>
                    <TextInput
                        label={this.props.t('account:PASSWORD')}
                        placeholder=''
                        type='password'
                        value={this.state.password}
                        onFieldChanged={(e: any) => this.handleFieldChange(e, 'password')} />
                    
                    <div className={styles.forgotPassword}>
                        <Link path={`/auth/forgot-password${this.state.email ? `?email=${this.state.email}` : ''}`}>{this.props.t('auth:FORGOT_PASSWORD')}</Link>
                </div>
                </div>
                
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
                        value='submit'  
                        isBusy={this.state.isInProgress}
                    >
                        {this.props.t(`auth:${this.props.label || LABEL_SIGN_IN}`)}
                    </Button>    
                </div>
            </form>
        );
    }
}

export default translate(['auth', 'account'])(connect<null, { signIn: Function }, { onChange?: Function }>(null, {
    signIn
})(SignInForm)) as any;
