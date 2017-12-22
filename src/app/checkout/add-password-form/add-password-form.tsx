import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Row, TextInput, Button } from '../../common';

import * as styles from './add-password-form.scss';

import { addPassword } from '../../api/account';

class PasswordForm extends Component<any, any> {
    constructor(props: { onSubmit: Function, onCancel?: Function, t?: Function }) {
      super(props);

      this.state = {
          newPassword: null,
          error: null
      };

      this.handleFieldChanged = this.handleFieldChanged.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
    }

    handleFieldChanged(fieldName: string): Function {
        return (e: any) => this.setState({ [fieldName]: e.value });
    }

    async onSubmit(e: any) {
      e.preventDefault();

      try {
        const user = await addPassword(this.state.newPassword);
        this.props.onSubmit(user);
      } catch(error) {
        this.setState({
          error: error.message
        });
      }
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <TextInput
                    label={this.props.t('account:PASSWORD')}
                    placeholder=''
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
                    <Button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSubmit} ${styles.btnBlock}`} type='submit'>{this.props.t('common:SAVE')}</Button>
                    {this.props.onCancel && <Button className={`${styles.btn} ${styles.btnSecondary}`} type='button' onClick={this.props.onCancel}>{this.props.t('common:CANCEL')}</Button>}
                </div>
            </form>
        );
    }
}

export default translate(['page', 'common'])(PasswordForm);