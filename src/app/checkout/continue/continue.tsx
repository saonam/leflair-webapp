import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { verifyEmail } from '../../api/account';
import { FacebookSignInButton, LABEL_SIGN_IN } from '../../auth';
import { CheckoutLayout } from '../../layouts';
import { Container, Button, OrSeparator, Row } from '../../common';
import { history } from '../../router';
import { ShippingAddress } from '../shipping-address';
import { isSignedIn, readyForCheckout } from '../../redux/user.redux';
import { SignInForm } from '../../auth';
import { LABEL_SIGN_IN_AND_CHECKOUT } from '../../auth/sign-in-form/sign-in-form';

import * as styles from './continue.scss';

export const continueAction = (params: any, cookie: any, store: any) => {
  if (readyForCheckout(store.getState())) {
    history.replace('/cart/checkout');
    return;
  }

  return ({
    component: <CheckoutContinue />
  });
};

type ContinueProps = {
  readyForCheckout: boolean,
  t?: Function
};
type ContinueState = {
  signIn: boolean,
  isAddShippingAddress?:
  boolean
};

class ContinuePage extends Component<ContinueProps, ContinueState> {
    constructor(props: any) {
        super(props);

        this.state = {
            signIn: false,
            isAddShippingAddress: false
        };
    }

    componentWillReceiveProps(newProps: ContinueProps) {
        if (newProps.readyForCheckout) {
            history.replace('/cart/checkout');
        }
    }

    signIn() {
        return () => this.setState({
            signIn: true
        });
    }

    addShippingAddress() {
        return () => this.setState({
            isAddShippingAddress: true
        });
    }


    defaultTemplate() {
        return (
        <Container>
            {<div className={`${styles.colLg6} ${styles.colMd8} ${styles.offsetLg3} ${styles.offsetMd2} ${styles.continueContainer}`}>
                <h3 className={styles.title}>{this.props.t('checkout:MEMBER_CHECKOUT')}</h3>
                <p className={styles.textDesc}>{this.props.t('checkout:MEMBER_CHECKOUT_DESC')}</p>
                <p className={this.state.signIn ? styles.btnFacebook : ''}>
                    <FacebookSignInButton label={LABEL_SIGN_IN} redirect="/cart/checkout" id="btn-facebook-signin-checkout" />
                </p>
                {this.state.signIn ? (
                    <div>
                        <OrSeparator />
                        <SignInForm label={LABEL_SIGN_IN_AND_CHECKOUT} />
                    </div>
                ) : (
                        <p className={styles.btnEmail}>
                            <Button onClick={this.signIn()} id="btn-email-signin-checkout" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`}>{this.props.t('checkout:SIGN_IN_EMAIL')}</Button>
                        </p>
                    )}

                <div className={styles.separator}>
                    <hr />
                </div>
                <h3 className={styles.title}>{this.props.t('checkout:GUEST_CHECKOUT')}</h3>
                <p className={styles.textDesc}>{this.props.t('checkout:GUEST_CHECKOUT_DESC')}</p>
                <ShippingAddress />
            </div>}
        </Container>
        );
    }

    variantTemplate() {
        return ( <Container>
            <Row className={styles.variantContainer}>
                <div className={`${styles.colXl5} ${styles.colLg6} ${styles.offsetXl1} ${styles.offsetLg0} ${styles.guestSectionWrap}`}>
                    <h3 className={styles.title}>{this.props.t('checkout:GUEST_CHECKOUT')}</h3>
                    <p className={styles.textDesc}>{this.props.t('checkout:GUEST_CHECKOUT_DESC_SHORT')}</p>

                    { !this.state.isAddShippingAddress && <div>
                        <Button onClick={this.addShippingAddress()} id="btn-email-signin-checkout" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`}>{this.props.t('checkout:GUEST_CHECKOUT_CTA')}</Button>
                        <p className={styles.desc}>{this.props.t('checkout:GUEST_CHECKOUT_DESC_2')}</p>
                    </div> }
                    { this.state.isAddShippingAddress && <div className={styles.addBottomPadding}>
                        <ShippingAddress />
                    </div>}
                </div>
                
                <div id="guest-checkout-anchor" className={`${styles.colXl5} ${styles.colLg6} ${styles.continueContainer}`}>
                    <h3 className={styles.title}>{this.props.t('checkout:MEMBER_CHECKOUT')}</h3>
                    <p className={styles.textDesc}>{this.props.t('checkout:MEMBER_CHECKOUT_DESC')}</p>
                    <SignInForm label={LABEL_SIGN_IN_AND_CHECKOUT} />
                    <div className={styles.shortSeparator}><OrSeparator /></div>
                    <p className={this.state.signIn ? styles.btnFacebook : ''}>
                        <FacebookSignInButton label={LABEL_SIGN_IN} redirect="/cart/checkout" id="btn-facebook-signin-checkout" />
                    </p>
                </div>
            </Row>
        </Container>);
    }

    render() {
        return (
            <CheckoutLayout className={styles.paddingRemove}>
                {this.defaultTemplate()}
            </CheckoutLayout>
        );
    }
}

const CheckoutContinue = connect((state) => ({
    readyForCheckout: readyForCheckout(state)
}), null)(translate('checkout')(ContinuePage)) as any;
