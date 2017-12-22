import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';


import * as styles from './process-indicator.scss';

const ProcessIndicator: SFC<{ step?: Number, className?: string, t?: Function }> = (props) => (
    <div className={`${styles.indicatorSection} ${props.className || ''}`}>
        <div className={styles.indicatorWrap}>
            <div className={`${styles.step} ${styles.completed}`}>
                <i className={`${props.step === 2 && 'ic-ic-check-mark'} ${styles.icon}`}> </i>
                <span>{props.t('checkout:STEP_1')}</span>
            </div>
            <div className={`${styles.step} ${props.step === 2 && styles.completed}`}>
                <span>{props.t('checkout:STEP_2')}</span>
            </div>
        </div>
    </div>
);

export default translate('checkout')(ProcessIndicator);
