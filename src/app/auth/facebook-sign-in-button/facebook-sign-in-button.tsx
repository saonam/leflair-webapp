import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { signInByFacebookUrl } from '../../api/account';

import * as styles from './facebook-sign-in-button.scss';

export const LABEL_CHECKOUT = 'checkout:SIGN_IN_FACEBOOK';
export const LABEL_CONTINUE = 'auth:CONTINUE_WITH_FACEBOOK';
export const LABEL_SIGN_IN = 'auth:SIGN_IN_WITH_FACEBOOK';

export const FacebookSignInButton = translate(['auth, checkout'])((props: { label?: string, id?: string, redirect?: string, t: Function }) => (
    <a href={`${signInByFacebookUrl}?${props.redirect ? `redirect=${typeof window !== 'undefined' ? location.origin : ''}${props.redirect}` : ''} `}
        id = {props.id} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock} ${styles.btnFacebookSignIn}`}>
        <i className="ic-facebook"></i>
        {props.t(props.label || 'auth:SIGN_IN_WITH_FACEBOOK')}
    </a>
) as any);
