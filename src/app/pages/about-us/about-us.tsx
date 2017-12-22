import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { DefaultLayout } from '../../layouts';
import { Container, Row, Image } from '../../common';

import { PagesNav } from '../pages-nav';

import * as styles from './about-us.scss';

export const aboutUsAction = () => {
  const AboutUs = translate('page')(AboutUsComponent);

  return {
    component: <AboutUs />
  };
};

const AboutUsComponent: SFC<any> = (props) => (
    <DefaultLayout>
        <PagesNav currentPage="ABOUT_US" />
        <div className={styles.pageContainer}>
            <div className={styles.headerBanner}></div>
        </div>

        <Container>
            <div className={styles.contentBody}>
                <div className={styles.pageTitle}>
                    {props.t('page:ABOUT_US')}
                </div>
                <p className={styles.text}>{props.t('page:ABOUT_US_TEXT_1')}</p>
                <p className={styles.text}>{props.t('page:ABOUT_US_TEXT_2')}</p>
                <p className={styles.text}>{props.t('page:ABOUT_US_TEXT_3')}</p>
                <p className={styles.text}>{props.t('page:ABOUT_US_TEXT_4')}</p>
                <p className={styles.text}>{props.t('page:ABOUT_US_TEXT_5')}</p>
                <p className={styles.text}>{props.t('page:ABOUT_US_TEXT_6')}</p>
            </div>
        </Container>
    </DefaultLayout>
);
