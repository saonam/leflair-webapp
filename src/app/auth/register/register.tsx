import * as React from 'react';

import AuthPage from '../auth';
import { RegisterForm } from './register-form';

import * as styles from './register.scss';

export const registerAction = () => {
  const Component = AuthPage('auth:REGISTER', <RegisterForm />, styles.register);

  return {
    component: <Component />
  };
};
