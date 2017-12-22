import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Row, TextInput, Button } from '../../../common';

import * as styles from './password-form.scss';

import { addPassword, changePassword } from '../../../api/account';

class PasswordForm extends Component<any, any> {
    constructor(props: { status: string, onSubmit: Function, onCancel: Function, t: Function }) {
      super(props);

      this.state = {
          currentPassword: null,
          newPassword: null,
          error: null,
          isInProgress: false
      };

      this.handleFieldChanged = this.handleFieldChanged.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
    }

    handleFieldChanged(fieldName: string): Function {
        return (e: any) => this.setState({ [fieldName]: e.value });
    }

    async onSubmit(e: any) {
      e.preventDefault();

      this.setState({
        isInProgress: true
      });

      if (this.props.status === 'pending') {
        try {
          const user = await addPassword(this.state.newPassword);

          this.setState({
            error: null,
            isInProgress: false
          });

          this.props.onSubmit(user);
        } catch(error) {
          this.setState({
            error: error.message,
            isInProgress: false
          });
        }
      } else {
        try {
          const user = await changePassword(this.state.currentPassword, this.state.newPassword);

          this.setState({
            error: null,
            isInProgress: false
          });

          this.props.onSubmit(user);
        } catch(error) {
          this.setState({
            error: error.message,
            isInProgress: false
          });
        }
      }
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                {this.props.status !== 'pending' && <TextInput
                    label={this.props.t('account:CURRENT_PASSWORD')}
                    placeholder='••••••••••'
                    type='password'
                    onFieldChanged={this.handleFieldChanged('currentPassword')}
                    required={true} />}
                <TextInput
                    label={this.props.t(`account:${this.props.status === 'pending' ? 'PASSWORD' : 'NEW_PASSWORD'}`)}
                    placeholder='••••••••••'
                    type='password'
                    onFieldChanged={this.handleFieldChanged('newPassword')}
                    required={true} />

                {this.state.error && (
                  <div className={`${styles.formGroup} ${styles.hasDanger}`}>
                    <div className={styles.formControlFeedback}>
                      {this.props.t(`common:${this.state.error}`)}
                    </div>
                  </div>
                )}

                <div className={styles.formGroup}>
                    <Button
                      className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSubmit}`}
                      type='submit'
                      isBusy={this.state.isInProgress}
                    >{this.props.t('common:SAVE')}</Button>
                    <Button className={`${styles.btn} ${styles.btnSecondary}`} type='button' onClick={this.props.onCancel}>{this.props.t('common:CANCEL')}</Button>
                </div>
            </form>
        );
    }
}

export default translate(['page', 'common'])(PasswordForm);