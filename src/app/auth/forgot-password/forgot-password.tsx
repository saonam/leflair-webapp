import * as React from 'react';

import AuthPage from '../auth';
import { ForgotPasswordForm } from './forgot-password-form';

import * as styles from './forgot-password.scss';

export const forgotPasswordAction = () => {
  const Component = AuthPage('auth:FORGOT_PASSWORD', <ForgotPasswordForm />, styles.forgotPw);

  return {
    component: <Component />
  };
};
