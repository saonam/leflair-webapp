import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Row, TextInput, Button } from '../../../common';

import * as styles from './personal-info-form.scss';

import { PersonalInfoProps, updatePersonalInfo } from '../../../api/account';

class PersonalInfoForm extends Component<any, any> {
    constructor(props: { info: PersonalInfoProps, onSubmit: Function, onCancel: Function, t: Function }) {
      super(props);

      this.state = {
        ...props.info,
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

      this.setState({ isInProgress: true });

      try {
        const info = await updatePersonalInfo(this.state.firstName, this.state.lastName, this.state.email);
        this.setState({
          error: null,
          isInProgress: false
        });

        this.props.onSubmit(info);
      } catch(error) {
        this.setState({
          error: error.message,
          isInProgress: false
        });
      }
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <Row>
                    <div className={styles.col6}>
                        <TextInput
                            label={this.props.t('account:LAST_NAME')}
                            placeholder={this.props.t('account:LAST_NAME')}
                            value={this.state.lastName}
                            onFieldChanged={this.handleFieldChanged('lastName')}
                            required={true} />
                    </div>
                    <div className={styles.col6}>
                        <TextInput
                            label={this.props.t('account:FIRST_NAME')}
                            placeholder={this.props.t('account:FIRST_NAME')}
                            value={this.state.firstName}
                            onFieldChanged={this.handleFieldChanged('firstName')}
                            required={true} />
                    </div>
                </Row>

                <TextInput
                    type={'email'}
                    label={this.props.t('account:EMAIL')}
                    placeholder={this.props.t('account:EMAIL')}
                    value={this.state.email}
                    onFieldChanged={this.handleFieldChanged('email')}
                    disabled={true} />

                {this.state.error && (
                  <div className={`${styles.formGroup} ${styles.hasDanger}`}>
                    <div className={styles.formControlFeedback}>{this.props.t(`common:${this.state.error}`)}</div>
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

export default translate(['page', 'common'])(PersonalInfoForm);