import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { StaticPage, Link, Button } from '../common';

import * as styles from './not-found.scss';

const Error: SFC<{}> = (props: any) => (
    <StaticPage>
        <div className={styles.pageSection} >
            <div className={styles.heroImage}>
                <img src="/images/404-pupy.jpg"/>
            </div>

            <div className={styles.caption}>
                <h1 className={styles.title}>{props.t('common:ERROR_TITLE')}</h1>
                <h3>{props.t('common:ERROR_SUBTITLE')}</h3>
                <p className={styles.desc}>{props.t('common:ERROR_DESC')}</p>
                <p className={styles.desc2}>{props.t('common:ERROR_DESC_2_a')} <i className="ic-spinner11"></i> {props.t('common:ERROR_DESC_2_b')}</p>
                <Link path={'/'}>
                    <Button className={[styles.btn, styles.btnPrimary, styles.btnHome].join('  ')}>{props.t('common:ERROR_CTA')}</Button>
                </Link>
            </div>
        </div>
    </StaticPage>
);

export default translate('page')(Error);;