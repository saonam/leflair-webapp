import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { DefaultLayout } from '../../layouts';
import { Container, Row, Image, StaticPage } from '../../common';

import { PagesNav } from '../pages-nav';

import * as styles from './partners.scss';

export const partnersAction = () => {
  const Partners = translate('page')(PartnersComponent);

  return {
    component: <Partners />
  };
};

const PartnersComponent: SFC<any> = (props) => (
    <DefaultLayout>
        <PagesNav currentPage="PARTNERS" />

        <Container>
            <div className={styles.pageContainer}>
                <div className={styles.contentBody}>
                    <h2 className={styles.mainTitle}>{props.t('page:PARTNERS_HEADING_TITLE')}</h2>
                    <div className={styles.body}>
                        <div className={styles.myRow}>
                            <div className={[styles.part, styles.part1].join(' ')}>
                                <div className={styles.icon}>
                                    <i className="ic-ic-heart-fill"></i>
                                </div>
                                <div className={styles.title}>{props.t('page:PARTNERS_PART_1_TITLE')}</div>
                                <div className={styles.text}>{props.t('page:PARTNERS_PART_1_TEXT')}</div>
                            </div>
                            <div className={[styles.part, styles.part2].join(' ')}>
                                <div className={styles.icon}>
                                    <i className="ic-ic-thunder"></i>
                                </div>
                                <div className={styles.title}>{props.t('page:PARTNERS_PART_2_TITLE')}</div>
                                <div className={styles.text}>{props.t('page:PARTNERS_PART_2_TEXT')}</div>
                            </div>
                            <div className={[styles.part, styles.part3].join(' ')}>
                                <div className={styles.icon}>
                                    <i className="ic-ic-fire"></i>
                                </div>
                                <div className={styles.title}>{props.t('page:PARTNERS_PART_3_TITLE')}</div>
                                <div className={styles.text}>{props.t('page:PARTNERS_PART_3_TEXT')}</div>
                            </div>
                        </div>
                        <div className={styles.myRow}>
                            <div className={[styles.part, styles.part4].join(' ')}>
                                <div className={styles.icon}>
                                    <i className="ic-ic-vietnam"></i>
                                </div>
                                <div className={styles.title}>{props.t('page:PARTNERS_PART_4_TITLE')}</div>
                                <div className={styles.text}>{props.t('page:PARTNERS_PART_4_TEXT')}</div>
                            </div>
                            <div className={[styles.part, styles.part5].join(' ')}>
                                <div className={styles.icon}>
                                    <i className="ic-ic-phone"></i>
                                </div>
                                <div className={styles.title}>{props.t('page:PARTNERS_PART_5_TITLE')}</div>
                                <div className={styles.text}>{props.t('page:PARTNERS_PART_5_TEXT')}</div>
                                <a href="mailto:partner@leflair.vn">{props.t('page:PARTNERS_PART_5_SUB')}</a>
                            </div>
                            <div className={[styles.part, styles.part6].join(' ')}>
                                <div className={styles.icon}>
                                    <i className="ic-ic-teacup"></i>
                                </div>
                                <div className={styles.title}>{props.t('page:PARTNERS_PART_6_TITLE')}</div>
                                <div className={styles.text}>{props.t('page:PARTNERS_PART_6_TEXT')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>

    </DefaultLayout>

);
