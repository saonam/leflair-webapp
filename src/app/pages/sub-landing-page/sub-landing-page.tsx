import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { LandingpageLayout } from '../../layouts';
import { Container, Row } from '../../common';
import { SubscriptionForm } from '../../common/subscription-form';

import * as styles from './sub-landing-page.scss';

const pages = [
    { regex: /\/subscription/, page: 'Subscription Page' },
    { regex: /\/reactivation/, page: 'Reactivation Page' }
];

const CONDITION = {
    type: 'duration',
    duration: {
        from: new Date('2017/12/06 00:00:00'),
        to: new Date('2017/12/15 00:00:00')
    }
};

const isSeasonal = ({ type, duration, days }: any) => {
    switch (type) {
        case 'duration':
            return duration.from.getTime() < new Date().getTime() && new Date().getTime() < duration.to.getTime();

        case 'days':
            return days.some((day: string) => new Date().toISOString().indexOf(day) === 0);

        default:
            return false;
    }
};

const NormalHeroComp = (props: any) => (
    <div className={styles.pageContainer}>
        <Container>
            <div className={`${styles.colLg5} ${styles.section} ${styles.heroContainer} home-sub-form-anchor`}>
                <div className={styles.title}>{props.t('subscription:SUB_TAGLINE')}</div>
                <SubscriptionForm
                    title2={props.t('subscription:HOMEPAGE_TOP_SUBTEXT')}
                    thankYouSub={props.t('subscription:THANK_YOU_SUB')}
                    darkTheme={true}
                    context="Subscription Page" />
            </div>
        </Container>
    </div>
);

const SeasonalHeroComp = (props: any) => (
    <div className={styles.seasonalPageContainer}>
        <Container>
            <Row>
                <div className={`${styles.colLg5} ${styles.heroContainer} ${styles.sectionHero} ${styles.seasonalHeroContainer} home-sub-form-anchor`}>
                    <div className={styles.title}>{props.t('subscription:SUB_TAGLINE_SEASONAL')}</div>
                    <SubscriptionForm
                        title2={props.t('subscription:CTA_SEASONAL')}
                        thankYouSub={props.t('subscription:THANK_YOU_SUB')}
                        darkTheme={true}
                        context="Subscription Page" />
                </div>
                <div className={`${styles.colLg7} ${styles.heroImg} ${styles.sectionHero}`}>
                    <img src="/images/Seasonal-Text.jpg" alt=""/>
                </div>
            </Row>
        </Container>
    </div>
);

const NormalHero = translate('subscription')(NormalHeroComp);
const SeasonalHero = translate('subscription')(SeasonalHeroComp);

export const subLandingPageAction = () => {
    const SubLandingPage = translate('subscription')(SubLandingPageComponent);
    const context = pages.find(page => page.regex.test(location.pathname));

    return {
        component: <SubLandingPage context={context && context.page} />
    };
};

const SubLandingPageComponent: SFC<any> = (props) => (
    <LandingpageLayout>
        { isSeasonal (CONDITION) ? <SeasonalHero /> : <NormalHero /> }

        <div className={`${styles.sectionWrap} ${styles.sectionWrap1}`}>
            <Container>
                <div className={`${styles.section} ${styles.section1}`}>
                    <div className={`${styles.sectionContainer} ${styles.colLg4}`}>
                        <h3 className={styles.sectionTitle}>{props.t('subscription:SUB_HOME_BANNER_TITLE_1')}</h3>
                        <div className={styles.subTitle}>{props.t('subscription:SUB_HOME_BANNER_CONTENT_1')}</div>
                    </div>
                </div>
            </Container>
        </div>

        <div className={`${styles.sectionWrap} ${styles.sectionWrap2}`}>
            <Container>
                <div className={`${styles.section} ${styles.section2}`}>
                    <div className={`${styles.sectionContainer} ${styles.colLg4}`}>
                        <h3 className={styles.sectionTitle}>{props.t('subscription:SUB_HOME_BANNER_TITLE_2')}</h3>
                        <div className={styles.subTitle}>{props.t('subscription:SUB_HOME_BANNER_CONTENT_2')}</div>
                    </div>
                </div>
            </Container>
        </div>

        <div className={`${styles.sectionWrap} ${styles.sectionWrap3}`}>
            <Container>
                <div className={`${styles.section} ${styles.section3}`}>
                    <div className={`${styles.sectionContainer} ${styles.colLg4}`}>
                        <h3 className={styles.sectionTitle}>{props.t('subscription:SUB_HOME_BANNER_TITLE_3')}</h3>
                        <div className={styles.subTitle}>{props.t('subscription:SUB_HOME_BANNER_CONTENT_3')}</div>
                    </div>
                </div>
            </Container>
        </div>

        <div className={styles.subscriptionContainer}>
            <Container>
                <SubscriptionForm
                    title={props.t('subscription:SUBSCRIPTION_TITLE')}
                    subTitle={props.t('subscription:SUBSCRIPTION_SUBTEXT')}
                    thankYouSub={props.t('subscription:THANK_YOU_SUB')}
                    className={styles.contentWrap}
                    context={props.context}
                />
            </Container>
        </div>

    </LandingpageLayout>
);
