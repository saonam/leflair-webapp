import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { DefaultLayout } from '../../layouts';
import { Container, Row, Image } from '../../common';

import { PagesNav } from '../pages-nav';

import * as styles from './careers.scss';

export const careersAction = () => {
  const Careers = translate(['page', 'common'])(CareersComponent);

  return {
    component: <Careers />
  };
};

const CareersComponent: SFC<any> = (props) => (
    <DefaultLayout>
        <PagesNav currentPage="CAREERS" />

        <div className={styles.pageContainer}>
            <div className={styles.headerBanner}></div>
        </div>

        <Container>
            <div className={styles.contentBody}>
                <h2 className={styles.pageTitle}> {props.t('page:CAREER_HEADLING')} </h2>
                <p className={styles.text}>{props.t('page:CAREER_DESC')}</p>
                <h4 className={styles.title}>{props.t('page:CAREER_TITLE_1')}</h4>
                <p className={styles.text}>{props.t('page:CAREER_TEXT_1')}</p>
                <h4 className={styles.title}>{props.t('page:CAREER_TITLE_2')}</h4>
                <p className={styles.text}>{props.t('page:CAREER_TEXT_2')}</p>
                <h4 className={styles.title}>{props.t('page:CAREER_TITLE_3')}</h4>
                <p className={styles.text}>{props.t('page:CAREER_TEXT_3')}</p>
                <p>
                    <a className={`${styles.btn} ${styles.btnPrimary}`} href="http://leflair.co/careers" target="blank">{props.t('page:SEE_CAREER_BOARD')} </a>
                </p>
                <p className={styles.text}>
                    {props.t('page:SEND_EMAIL_TO')}
                    <a href="mailto:careers@leflair.vn"> careers@leflair.vn</a>
                </p>
            </div>
        </Container>
    </DefaultLayout>
);
