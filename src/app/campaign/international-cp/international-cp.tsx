import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { Container } from '../../common';

import * as styles from './international-cp.scss';

// ***** GUIDE *****
// type: 'duration',
// duration: {
//     from: new Date('2017-12-01 00:00:00'),
//     to: new Date('2017-12-02 00:00:00')
// }
// type: 'days',
// days: [ '2017-11-30', '2017-12-30' ]
// ***** GUIDE *****

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

const InternationalCampaignBannerCatComp: SFC<any> = (props) => (
    <Container>
        <div className={`${styles.colMd6} ${styles.offsetMd3}`}>
            <div className={styles.promoWrap}>
                <span className={styles.promoContent} dangerouslySetInnerHTML={{ __html: props.t('sales:CASHBACK_PROMO') }}></span>
            </div>
        </div>
    </Container>
);

const InternationalCampaignBannerCat = translate('sales')(InternationalCampaignBannerCatComp);
export default isValid(CONDITION) && InternationalCampaignBannerCat;