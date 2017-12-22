import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Row, TextInput, PhoneInput, Button } from '../../../common';

import * as styles from './address-form.scss';

import { AddressProps, CityProps, DistrictProps, getDistricts } from '../../../api/addresses';

class AddressForm extends Component<any, any> {
    constructor(props: {isCheckout?: boolean, type: string, address: AddressProps, districts: DistrictProps[], cities: CityProps[], error: string, className?: string, onSubmit: Function, onCancel: Function, t?: Function, isInProgress?: boolean }) {
        super(props);

        this.state = Object.assign(props.address, {
          duplicateBilling: props.type === 'shipping' && !props.address.id,
          districts: []
        });

        this.handleFieldChanged = this.handleFieldChanged.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        if (this.props.address.city) {
          getDistricts(this.props.address.city.id)
          .then((districts: DistrictProps[]) => {
            this.setState({
              districts
            });
          })
          .catch(console.error);
        }
    }

    handleFieldChanged(fieldName: string): Function {
      switch(fieldName) {
        case 'city':
          return async (e: any) => {
            try {
              const districts = e.value ? await getDistricts(e.value.id) : [];

              this.setState({
                city: e.value,
                district: null,
                districts
              });
            } catch(error) {
              console.error(error);
            }
          }
        default:
          return (e: any) => this.setState({
            [fieldName]: e.value
          });
      }
    }

    onSubmit(e: any) {
      e.preventDefault();

      const { duplicateBilling, districts, ...address } = this.state;
      this.props.onSubmit(address, duplicateBilling);
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                {this.props.error && (
                  <div className={styles.formGroup}>
                    <div className={`${styles.alert} ${styles.alertDanger}`}>{this.props.error}</div>
                  </div>
                )}
                <Row>
                    <div className={styles.col6}>
                        <TextInput
                            label={this.props.t('account:LAST_NAME')}
                            placeholder={this.props.t('account:LAST_NAME')}
                            type='text'
                            value={this.state.lastName}
                            onFieldChanged={this.handleFieldChanged('lastName')}
                            required={true} />
                    </div>
                    <div className={styles.col6}>
                        <TextInput
                            label={this.props.t('account:FIRST_NAME')}
                            placeholder={this.props.t('account:FIRST_NAME')}
                            type='text'
                            value={this.state.firstName}
                            onFieldChanged={this.handleFieldChanged('firstName')}
                            required={true} />
                    </div>
                </Row>

                {/*billing additional info*/}
                {this.props.type === 'billing' && (
                  <div>
                    <TextInput
                      label={`${this.props.t('account:COMPANY_NAME')} ${this.props.t('common:OPTIONAL')}`}
                      placeholder={this.props.t('account:COMPANY_NAME')}
                      type='text'
                      value={this.state.companyName}
                      onFieldChanged={this.handleFieldChanged('companyName')} />
                    <TextInput
                      label={`${this.props.t('account:TAX_CODE')} ${this.props.t('common:OPTIONAL')}`}
                      placeholder={this.props.t('account:TAX_CODE')}
                      type='text'
                      value={this.state.taxCode}
                      onFieldChanged={this.handleFieldChanged('taxCode')} />
                  </div>
                )}

                <TextInput
                    label={this.props.t('account:ADDRESS')}
                    placeholder={this.props.t('account:ADDRESS')}
                    type="text"
                    value={this.state.address}
                    onFieldChanged={this.handleFieldChanged('address')}
                    required={true}
                    maxLength={60}
                />

                <div className={styles.formGroup}>
                    <label className={styles.formControlLabel}>{this.props.t('account:CITY')}</label>
                    <div className={`${styles.selectStyle} ${styles.formControl}`}>
                      <select name="city" value={JSON.stringify(this.state.city)} onChange={(e: any) => this.handleFieldChanged('city')({value: JSON.parse(e.target.value)})} required>
                          <option value="">{this.props.t('account:SELECT_CITY')}</option>
                          {this.props.cities.map((city: CityProps) => (
                            <option key={city.id} value={JSON.stringify(city)}>{city.name}</option>
                          ))}
                      </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.formControlLabel}>{this.props.t('account:DISTRICT')}</label>
                    <div className={`${styles.selectStyle} ${styles.formControl}`}>
                      <select className={styles.formControl} name="district" value={JSON.stringify(this.state.district)} onChange={(e: any) => this.handleFieldChanged('district')({value: JSON.parse(e.target.value)})} required>
                          <option value="">{this.props.t('account:SELECT_DISTRICT')}</option>
                          {this.state.districts.map((district: DistrictProps) => (
                            <option key={district.id} value={JSON.stringify(district)}>{district.name}</option>
                          ))}
                      </select>
                    </div>
                </div>

                <PhoneInput
                    label={this.props.t('account:PHONE')}
                    placeholder={this.props.t('account:PHONE')}
                    value={this.state.phone}
                    onFieldChanged={this.handleFieldChanged('phone')}
                    required={true} />

                {this.props.type === 'shipping' && (
                  <div className={styles.formGroup}>
                    <label className={`${styles.customControl} ${styles.customCheckbox}`}>
                      <input type="checkbox" className={styles.customControlInput} name="duplicateBilling" checked={this.state.duplicateBilling} onChange={(e: any) => this.handleFieldChanged('duplicateBilling')({value: e.target.checked})} />
                      <span className={styles.customControlIndicator}></span>
                      <span className={styles.customControlDescription}>{this.props.t('account:USE_FOR_BILLING_ADDRESS')}</span>
                    </label>
                  </div>
                )}
                    
                <div className={styles.formGroup}>
                    <Button
                      className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSubmit}`}
                      type='submit'
                      isBusy={this.props.isInProgress}
                    >{this.props.t(this.props.isCheckout ? 'account:USE_THIS_ADDRESS' : 'common:SAVE')}</Button>
                    <Button className={`${styles.btn} ${styles.btnSecondary}`} type='button' onClick={this.props.onCancel}>{this.props.t('common:CANCEL')}</Button>
                </div>

            </form>
        );
    }
}

export default translate(['account', 'common'])(AddressForm);