import * as React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import * as qs from 'qs';

import AuthPage from '../auth';
import { FacebookSignInButton } from '../';
import { Container, OrSeparator, Link } from '../../common';
import { isSignedIn, getUser } from '../../redux/user.redux';
import { setAlert } from '../../redux/alert.redux';
import { SignInForm } from '../';
import { history } from '../../router';

import * as styles from './signin.scss';

type SignInFormProps = {
  t?: Function,
  isSignedIn: string | boolean,
  setAlert: Function,
  user: any, 
};

class SignIn extends React.Component<SignInFormProps, any> {
    constructor(props: any) {
        super(props);
        
        this.state = {
            email: '',
            redirect: (qs.parse(typeof window !== 'undefined' ? location.search.replace('?', '') : '')).redirect,
        };
    }

    componentDidMount() {
        if (this.props.isSignedIn) {
            history.replace(this.state.redirect);

            // Set a 300ms timeout for making sure we get the logged in user from redux
            setTimeout(() => {
                this.props.setAlert({
                    isVisible: true,
                    message: 'WELCOME_FIRST_LOGIN',
                    messageValue: { name: this.props.user.firstName },
                    timeOut: 4000,
                    type: 'success'
                });
            }, 300)
        }
    }

    componentWillReceiveProps(newProps: SignInFormProps) {
        if (newProps.isSignedIn) {
            history.replace(this.state.redirect);

            // Set a 300ms timeout for making sure we get the logged in user from redux
            setTimeout(() => {
                this.props.setAlert({
                    isVisible: true,
                    message: 'WELCOME_FIRST_LOGIN',
                    messageValue: { name: this.props.user.firstName },
                    timeOut: 4000,
                    type: 'success'
                });
            }, 300)
        }
    }

    handleChange() {
        return (fieldName: string, value: string) => {
          if (fieldName !== 'email') {
            return;
          }

          this.setState({ email: value });
        };
    }

    render() {
        return (
            <Container>
                <div className={styles.signInContainer}>
                  <div>
                      <FacebookSignInButton />
                  </div>
                  <OrSeparator />
                  <SignInForm onChange={this.handleChange()} />
                  <div className={styles.createAccount}>
                    {this.props.t('auth:NEW_TO_LEFLAIR')} <Link path={`/auth/register${this.state.email ? `?email=${this.state.email}` : ''}`}> {this.props.t('auth:CREATE_NEW_ACCOUNT')}</Link>
                  </div>
                </div>
            </Container>
        );
    }
}

const ConnectedSignIn = translate('auth')(connect((state) => ({
  isSignedIn: isSignedIn(state),
  user: getUser(state)
}), {
    setAlert
})(SignIn as any));

export const signinAction = () => {
  const Component = AuthPage('auth:SIGN_IN', <ConnectedSignIn />, styles.signIn);

  return {
    component: <Component />
  };
};
