import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { CityProps, DistrictProps } from '../../api/addresses';
import { Row, Link, TextInput, Button, PhoneInput } from '../../common';
import { history } from '../../router';
import { signInGuest, isSignedIn,  } from '../../redux/user.redux';

import * as styles from './shipping-address.scss';

import { verifyEmail } from '../../api/account';
import { getCityList, getDistrictList, loadCities, loadDistricts } from '../../redux/locations.redux';
import { signIn } from '../../redux/user.redux';
import * as addressesApi from '../../api/addresses';

class ShippingAddressComponent extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      city: '',
      district: '',
      phone: '',
      duplicateBilling: true,
      emailExisted: false,
      districts: [],
      type: 'shipping',
      error: '',
      isInProgress: false
    };

    this.onChangeField = this.onChangeField.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.props.loadCities();
  }

  componentDidMount() {
      if (this.props.isSignedIn) {
          history.replace('/cart/checkout');
      }
  }

  componentWillReceiveProps(newProps: any) {
      if (newProps.isSignedIn) {
          history.replace('/cart/checkout');
      }
  }

  onChangeField(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => this.setState({
      [field]: e.target.value
    });
  }

  onChangeEmail() {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      this.onChangeField('email')(e);

      if (/.+\@.+\..+/.test(value)) {
        setTimeout(async () => {
          try {
            const data = await verifyEmail(value);

            if (value !== this.state.email) {
              // This could happen if requests get delayed
              return;
            }

            this.setState({
              emailExisted: data.existed
            });
          } catch(error) {
            console.error(error);
          }
        }, 0);
      } else {
        this.setState({
          emailExisted: false
        });
      }
    }
  }

  onChangeCity() {
    return (city: CityProps) => {
      this.props.loadDistricts(city.id);
      this.setState({
        city: city,
        district: null
      });
    }
  }

  onChangeDistrict() {
    return (district: DistrictProps) => {
      this.setState({
        district
      });
    }
  }

  onChangeDuplicateBilling() {
    return (e: any) => {
      this.setState({
        duplicateBilling: e.target.checked
      });
    }
  }

  async onSubmit(e: any) {
    e.preventDefault();

    if (this.state.emailExisted) {
      return;
    }

    this.setState({
      error: '',
      isInProgress: true
    });

    this.props.signInGuest(this.state);
    history.push('/cart/checkout');
    this.setState({
      error: '',
      isInProgress: false
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">{this.props.t('account:EMAIL')}</label>
          <input className={styles.formControl} type="email" placeholder="example@example.com" onChange={this.onChangeEmail()} required />
          {this.state.emailExisted ? (
            <div className={`${styles.alert} ${styles.alertWarning}`}>
              {this.props.t('auth:ERROR_EMAIL_REGISTERED')}
            </div>
          ) : (
            <small className={styles.small}>{this.props.t('auth:EMAIL_DESC')}</small>
          )}
        </div>

        { !this.state.emailExisted && <div>
          <h4 className={styles.title}>
            {this.props.t('account:SHIPPING_ADDRESS')}
          </h4>

          <fieldset>
            <Row className={styles.formGroup}>
                <div className={styles.col6}>
                  <label htmlFor="last-name">{this.props.t('account:LAST_NAME')}</label>
                  <input className={styles.formControl} name="lastName" type="text" id="last-name" placeholder={this.props.t('account:LAST_NAME')} onChange={this.onChangeField('lastName')} required />
                </div>
                <div className={styles.col6}>
                  <label htmlFor="first-name">{this.props.t('account:FIRST_NAME')}</label>
                  <input className={styles.formControl} name="firstName" type="text" id="first-name" placeholder={this.props.t('account:FIRST_NAME')} onChange={this.onChangeField('firstName')} required />
                </div>
            </Row>

            <TextInput
              label={this.props.t('account:ADDRESS')}
              name="address"
              placeholder="Ví dụ: 12 Tôn Đản"
              onFieldChanged={(data: any) => this.setState({ address: data.value })}
              required={true}
              maxLength={60}
            />

            <div className={styles.formGroup}>
              <label htmlFor="city">{this.props.t('account:CITY')}</label>
              <div className={`${styles.selectStyle} ${styles.formControl}`}>
                <select className={styles.formControl} name="city" value={JSON.stringify(this.state.city)} onChange={(e: any) => this.onChangeCity()(JSON.parse(e.target.value))} required>
                  <option value="">{this.props.t('account:SELECT_CITY')}</option>
                  {this.props.cities.map((city: CityProps) => (
                    <option key={city.id} value={JSON.stringify(city)}>{city.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="district">{this.props.t('account:DISTRICT')}</label>
              <div className={`${styles.selectStyle} ${styles.formControl}`}>
                <select className={styles.formControl} name="district" value={JSON.stringify(this.state.district)} onChange={(e: any) => this.onChangeDistrict()(JSON.parse(e.target.value))} required>
                  <option value="">{this.props.t('account:SELECT_DISTRICT')}</option>
                  {this.props.getDistricts(this.state.city.id).map((district: DistrictProps) => (
                    <option key={district.id} value={JSON.stringify(district)}>{district.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <PhoneInput
              label={this.props.t('account:PHONE')}
              placeholder="0978111000"
              value={this.state.phone}
              onFieldChanged={(data: any) => this.setState({ phone: data.value })}
              required={true}
              small={this.props.t('auth:PHONE_DESC')}
            />

            <div className={styles.formGroup}>
              <label className={`${styles.customControl} ${styles.customCheckbox}`}>
                <input type="checkbox" className={styles.customControlInput} name="duplicateBilling" checked={this.state.duplicateBilling} onChange={this.onChangeDuplicateBilling()} />
                <span className={styles.customControlIndicator}></span>
                <span className={styles.customControlDescription}>{this.props.t('account:USE_FOR_BILLING_ADDRESS')}</span>
              </label>
            </div>
          </fieldset>

          <Button
            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSave}`}
            type="submit"
            value="submit"
            isBusy={this.state.isInProgress}>
            {this.props.t('common:SAVE_AND_CONTINUE')}
          </Button>
        </div> }
      </form>
    );
  }
}

export const ShippingAddress = translate(['account', 'auth'])(connect(
  (state) => ({
    cities: getCityList(state),
    getDistricts: (cityId: string) => getDistrictList(state, cityId),
    isSignedIn: isSignedIn(state)
  }), {
  signInGuest,
  loadCities,
  loadDistricts,
  signIn
})(ShippingAddressComponent as any));
