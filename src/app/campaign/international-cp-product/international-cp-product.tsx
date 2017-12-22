import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { Container } from '../../common';


import * as styles from './international-cp-product.scss';

const CONDITION = {
    type: 'duration',
    duration: {
        from: new Date('2017/12/01 00:00:00'),
        to: new Date('2017/12/02 00:00:00')
    }
};

const isValid = ({ type, duration, days }: any) => {
    switch (type) {
        case 'duration':
            return duration.from.getTime() < new Date().getTime() && new Date().getTime() < duration.to.getTime();

        case 'days':
            return days.some((day: string) => new Date().toISOString().indexOf(day) === 0);

        default:
            return false;
    }
};

const InternationalCampaignBannerProductComp: SFC<any> = (props) => (
    <div className={`${styles.promoProductWrap} ${props.className || ''}`}>
        <div className={styles.promoProductContent}>
            {props.t('products:CASHBACK_PROMOTION')}
            <div className={styles.promoSub}>{props.t('products:CASHBACK_PROMOTION_INFO')}</div>
        </div>

    </div>
);

const InternationalCampaignBannerProduct = translate('sales')(InternationalCampaignBannerProductComp);
export default isValid(CONDITION) && InternationalCampaignBannerProduct;