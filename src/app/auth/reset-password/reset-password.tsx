import * as React from 'react';

import AuthPage from '../auth';
import { ResetPasswordForm } from './reset-password-form';

import * as styles from './reset-password.scss';

export const resetPasswordAction = (params?: any) => {
  const Component = AuthPage('auth:RESET_PASSWORD', <ResetPasswordForm token={params.token} />, styles.resetPw);

  return {
    component: <Component />
  };
};
