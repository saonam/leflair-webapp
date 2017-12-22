import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { getCurrentLang } from '../../redux/user.redux';
import { InternationalCampaignBannerProduct } from '../../campaign';

import * as styles from './additional-info.scss';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type AdditionalInfoProps = {
  available: boolean;
  returnable: boolean;
  returnDays: number;
  isOverseas: boolean;
  className?: string;
  t?: Function
};

class AdditionalInfo extends React.Component<AdditionalInfoProps, any>{
  constructor(props: AdditionalInfoProps) {
    super(props);
  }

  render() {
    const date = new Date();
    const currentDay = date.getDay();

    if (currentDay === 5 || (currentDay >= 3 && this.props.isOverseas)) {
      date.setDate(date.getDate() + 1);
    }

    date.setDate(date.getDate() + (this.props.isOverseas ? 4 : 2));
    const dayFrom = days[date.getDay()];
    const dateFromStr = date.getDate() + '/' + (date.getMonth() + 1);
    date.setDate(date.getDate() + (this.props.isOverseas ? 7 : (currentDay !== 5 ? 6 : 5)));
    const dayTo = days[date.getDay()];
    const dateToStr = date.getDate() + '/' + (date.getMonth() + 1);

    return (
      <div className={this.props.className || ''}>
            {!this.props.isOverseas ? (
              <div>
                <div className={styles.item}>
                  <i className={`${styles.icon} ic-ic-guarantee`} /> {this.props.t('products:GENUINE_PRODUCT_GUARANTEED')}
                </div>

                {this.props.available && (
                  <div className={styles.item}>
                    <i className={`${styles.icon} ic-ic-ship`} /> 
                    {this.props.t('products:ESTIMATED_DELIVERY_DATE')}
                    <span className={styles.dateDelivery}>
                      {this.props.t(`products:${dayFrom}`)}
                      {dateFromStr}
                      {` - `}
                      {this.props.t(`products:${dayTo}`)}
                      {dateToStr}
                    </span>
                  </div>
                )}

                {this.props.available && this.props.returnable ? (
                  <div className={styles.item}>
                    <i className={`${styles.icon} ic-ic-return`} /> {this.props.t('products:RETURNABLE_DAYS', { returnDays: this.props.returnDays })}
                  </div>
                ) : (
                  <div className={styles.item}>
                  <i className={`${styles.icon} ic-ic-return-none`} /> {this.props.t('products:NON_RETURNABLE')}
                  </div>
                )}

              </div>
            ) : (
              <div className={styles.internationalWrap}>
                  {/* cashback campaign promottion */}
                  { InternationalCampaignBannerProduct && <InternationalCampaignBannerProduct />}
                  
                  <div className={styles.intTitle}>
                    {this.props.t('products:INT_PRODUCT_POLICY')}
                  </div>
                  <div className={`${styles.item} ${styles.highlight}`}>
                    <i className={`${styles.icon} ${styles.highlight} ic-ic-globe`} /> {this.props.t('products:FREE_EXPRESS_SHIPPING')}
                  </div>

                  <div className={styles.item}>
                    <i className={`${styles.icon} ic-ic-ship`} />
                    {this.props.t('products:ESTIMATED_DELIVERY_DATE')}
                    <span className={styles.dateDelivery}>
                      {this.props.t(`products:${dayFrom}`)}
                      {dateFromStr}
                      {` - `}
                      {this.props.t(`products:${dayTo}`)}
                      {dateToStr}
                    </span>
                  </div>

                  <div className={styles.item}>
                    <i className={`${styles.icon} ic-ic-guarantee`} /> {this.props.t('products:GENUINE_PRODUCT_GUARANTEED')}
                  </div>

                  <div className={styles.item}>
                    <i className={`${styles.icon} ${styles.iconFix} ic-ic-credit-card-filled`} /> {this.props.t('products:PAY_BY_CC_ONLY')}
                  </div>

                </div>
            )}
        </div>
    );
  }

};

export default translate('products')(AdditionalInfo);
