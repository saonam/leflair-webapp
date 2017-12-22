import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { DefaultLayout } from '../../layouts';
import { Container, Row, Image, StaticPage } from '../../common';

import { PagesNav } from '../pages-nav';

import * as styles from './gg.scss';

export const ggAction = () => {
  const GG = translate('page')(GGComponent);

  return {
    component: <GG />
  };
};

const GGComponent: SFC<any> = (props) => (
    <DefaultLayout>
        <PagesNav currentPage="GENUINE_GUARANTEE" />

        <Container>
            <div className={styles.pageContainer}>

                <div className={styles.section}>
                    <div className={styles.container}>
                        <h2 className={styles.mainTitle}>{props.t('page:GG_SECTION_1_TITLE')}</h2>
                        <p className={styles.text}>{props.t('page:GG_SECTION_1_TEXT')}</p>
                        <p className={styles.text}>{props.t('page:GG_SECTION_1_TEXT_2')}</p>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.container}>
                        <h4 className={styles.title}>{props.t('page:GG_SECTION_2_TITLE')}</h4>
                        <p className={styles.text}>{props.t('page:GG_SECTION_2_TEXT')}</p>
                        <ul className={styles.text}>
                            <li>{props.t('page:GG_SECTION_2_TEXT_1')}</li>
                            <li>{props.t('page:GG_SECTION_2_TEXT_2')}</li>
                        </ul>
                    </div>
                </div>


                <div className={[styles.section, styles.section4].join('  ')}>
                    <div className={styles.container}>
                        <h4 className={styles.title}>{props.t('page:GG_SECTION_4_TITLE')}</h4>
                        <p className={styles.text}>{props.t('page:GG_SECTION_4_TEXT')}</p>
                        <img className={styles.image} src="/images/gg-1@2x-min.jpg" />
                    </div>
                </div>

                <div className={[styles.section, styles.section5].join('  ')}>
                    <div className={styles.container}>
                        <h4 className={styles.title}>{props.t('page:GG_SECTION_5_TITLE')}</h4>
                        <p className={styles.text}>{props.t('page:GG_SECTION_5_TEXT')}</p>
                        <ul className={styles.text}>
                            <li>{props.t('page:GG_SECTION_5_TEXT_1')}</li>
                            <li>{props.t('page:GG_SECTION_5_TEXT_2')}</li>
                        </ul>
                    </div>
                </div>

            </div>

            <div className={[styles.section, styles.section5].join('  ')}>
                <Row className={styles.imageGroup3Img} >
                    <div className={[styles.colSm4, styles.col12, styles.childImage].join('  ')}>
                        <img src="/images/gg-2@2x-min.jpg" />
                    </div>
                    <div className={[styles.colSm4, styles.col12, styles.childImage].join('  ')}>
                        <img src="/images/gg-3@2x-min.jpg" />
                    </div>
                    <div className={[styles.colSm4, styles.col12, styles.childImage].join('  ')}>
                        <img src="/images/gg-4@2x-min.jpg" />
                    </div>
                </Row>
            </div>
        </Container>
        
    </DefaultLayout>
);
