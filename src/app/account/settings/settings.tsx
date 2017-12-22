import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { DefaultLayout } from '../../layouts';
import { Container, Row, Currency } from '../../common';
import { updateUser, getUser } from '../../redux/user.redux';

import { AccountNav } from '../account-nav';
import { PersonalInfoForm } from './personal-info-form';
import { PasswordForm } from './password-form';

import * as styles from './settings.scss';

import { UserProps } from '../../api/account';

export const settingsAction = () => {
  const Settings = translate(['page', 'common'])(ConnectedSetting);

  return {
    component: <Settings />
  };
};

class SettingsComponent extends Component<any, any> {
    constructor(props: {user: UserProps, updateUser: Function, className?: string, t?: Function}) {
      super(props);

      this.state = {
        personalInfoForm: false,
        passwordForm: false
      };

      this.showForm = this.showForm.bind(this);
      this.hideForm = this.hideForm.bind(this);
    }

    showForm(form: string) {
      this.setState({
        [form]: true
      });
    }

    hideForm(form: string) {
      this.setState({
        [form]: false
      });
    }

    render() {
        return (
            <DefaultLayout>
                <Container>
                    <div className={styles.pageContainer}>
                        <Row>
                            <div className={`${styles.colMd3} ${styles.navSection}`}>
                                <AccountNav currentPage="MY_SETTINGS_SHORT" />
                            </div> 

                            <div className={styles.colMd7}>
                                <div className={styles.container}>
                                    <h3 className={styles.pageTitle}>{this.props.t('account:MY_SETTINGS')}</h3>

                                    {/*credit info*/}
                                    <div className={styles.creditInfo}>
                                        <div className={`${styles.heading} ${styles.clearfix}`}>
                                            <h4 className={styles.title}>{this.props.t('account:CREDIT_INFO')}</h4>
                                            <div className={styles.creditAmount}>
                                              <Currency amount= {this.props.user.accountCredit} />
                                            </div>
                                        </div>
                                        <div className={styles.content}>
                                            <div className={styles.creditDesc}>{this.props.t('account:CREDIT_DESC')}</div>
                                        </div>
                                    </div>

                                    {/*personal info*/}
                                    <div className={styles.personalInfo}>
                                        <div className={`${styles.heading} ${styles.clearfix}`}>
                                            <h4 className={styles.title}>{this.props.t('account:PERSONAL_INFO')}</h4>
                                            <div className={styles.action}>
                                                <a href="javascript:void(0)" onClick={() => this.showForm('personalInfoForm')}>{this.props.t('common:EDIT')}</a>
                                            </div>
                                        </div>
                                        {!this.state.personalInfoForm ? (
                                          <div className={styles.content}>
                                            <Row className={`${styles.formGroup} ${styles.resetMargin}`}>
                                                <div className={styles.col6}>{this.props.t('account:FULL_NAME')}</div>
                                                <div className={`${styles.col6} ${styles.textRight}`}>
                                                  {[this.props.user.lastName, this.props.user.firstName].join(' ')}
                                                </div>
                                            </Row>
                                            <Row className={`${styles.formGroup} ${styles.resetMargin}`}>
                                                <div className={styles.col3}>{this.props.t('account:EMAIL')}</div>
                                                <div className={`${styles.col9} ${styles.textRight}`}>
                                                  {this.props.user.email}
                                                </div>
                                            </Row>
                                          </div>
                                        ) : (<div className="body edit">
                                            <Row>
                                                <div className={styles.colMd8}>
                                                    <PersonalInfoForm
                                                      info={{
                                                        firstName: this.props.user.firstName,
                                                        lastName: this.props.user.lastName,
                                                        email: this.props.user.email}}
                                                      onSubmit={(user: UserProps) => {
                                                        this.props.updateUser(user);
                                                        this.hideForm('personalInfoForm');
                                                      }}
                                                      onCancel={() => this.hideForm('personalInfoForm')} />
                                                </div>
                                            </Row>
                                          </div>
                                        )}
                                    </div>

                                    {/*password*/}
                                    <div className={styles.password}>
                                        <div className={`${styles.heading} ${styles.clearfix}`}>
                                            <h4 className={styles.title}>{this.props.t('account:PASSWORD')}</h4>
                                            <div className={styles.action}>
                                                <a href="javascript:void(0)" onClick={() => this.showForm('passwordForm')}>
                                                  {this.props.t(`account:${this.props.user.state === 'pending' ? 'ADD_PASSWORD' : 'CHANGE_PASSWORD'}`)}
                                                </a>
                                            </div>
                                        </div>
                                        {this.state.passwordForm && (
                                          <div className="body edit">
                                            <Row>
                                                <div className={styles.colMd8}>
                                                    <PasswordForm
                                                      status={this.props.user.state}
                                                      onSubmit={(user: UserProps) => {
                                                        this.props.updateUser(user);
                                                        this.hideForm('passwordForm');
                                                      }}
                                                      onCancel={() => this.hideForm('passwordForm')} />
                                                </div>
                                            </Row>
                                          </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Row>
                    </div>

                </Container>
            </DefaultLayout>
        )
    }
}

const ConnectedSetting = connect(
  (state) => ({
    user: getUser(state)
  }), {
    updateUser
  }
)(SettingsComponent as any);
