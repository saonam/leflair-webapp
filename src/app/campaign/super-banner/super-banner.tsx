import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { Row, Link } from '../../common';


import * as styles from './super-banner.scss';

const CONDITION = {
    type: 'duration',
    duration: {
        from: new Date('2017/12/07 21:00:00'),
        to: new Date('2017/12/10 10:00:00')
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

const SuperBannerComp: SFC<any> = props => isValid(CONDITION) && (
    <Row>
        <Link path='/sales/elle-fashion-journey-collection-5a29f556dd1b3100104b3b96' className={`${styles.colMd12} ${styles.secretSalesBanner}`}>
            <div className={styles.secretSalesBannerInner}>
                <div className={`${styles.colLg6} ${styles.col10} ${styles.titleSection}`}>
                    <h2 className={styles.secretSaleTitle}>{props.t('home:SUPER_BANNER_TITLE')}</h2>
                    <h4 className={styles.secretSaleDescription}>{props.t('home:SUPER_BANNER_SUBTITLE')}</h4>
                    <h4 className={styles.secretSaleLink}>{props.t('home:SUPER_BANNER_CTA')}</h4>
                </div>
            </div>
        </Link>
    </Row>
);

export default translate('home')(SuperBannerComp);
