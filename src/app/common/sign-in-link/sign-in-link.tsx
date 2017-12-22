import * as React from 'react';
import { translate } from 'react-i18next';

import { Link } from '../../common';

import * as styles from './sign-in-link.scss';

const SignInLink = (props: any) => {
    return <Link path={`/auth/signin?redirect=${typeof window !== 'undefined' ? location.pathname : ''}${(typeof window !== 'undefined' ? location.search : '') || ''}`} {...props}>
        { props.children || props.t('auth:SIGN_IN') }
    </Link>
}

export default translate(['auth'])(SignInLink);
