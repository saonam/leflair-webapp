import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { DefaultLayout } from '../../layouts';
import { Container, Grid, Row, Image, Link, Button } from '../../common';
import { InternationalCampaignBannerCat } from '../../campaign';
import { EndTime } from '../../sale/end-time';

import { SaleCard } from '../../home';
import  { isBigCampaign } from '../../campaign';

import * as styles from './international.scss';

import { SaleProps } from '../../api/home';
import { TrackCategory } from '../../api/rtb-house';

import { FirstSaleTile } from '../../category/first-sale-tile';

type CategoryProps = {
    category: string,
    sales: SaleProps[],
    className?: string,
    t?: Function
};

class InternationalLayout extends React.Component<any, any> {
    constructor(props: CategoryProps) {
        super(props);
        this.state = {
            scrollDownVisible: true
        };

        this.scrollDown = this.scrollDown.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    scrollDown = (e: any) => {
        window.scrollTo(0, window.innerHeight);
        this.setState({ scrollDownVisible: false });
    }

    handleScroll = (e: any) => {
        if (window.pageYOffset <= 30) {
            this.setState({ scrollDownVisible: true });
        } else {
            this.setState({ scrollDownVisible: false });
        }

    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    render() {
        return (
            <DefaultLayout className={`${isBigCampaign && styles.seasonalLayout} ${styles.paddingTop}`}>
                <div className={styles.overseasBanner}>
                    <Container>
                        <div className={`${styles.colMd8} ${styles.colLg6} ${styles.bannerDescriptionWrapper}`}>
                            <h4 className={styles.title}>{this.props.t('sales:INTERNATIONAL_TITLE')}</h4>
                            <div className={styles.mission}>{this.props.t('sales:OVERSEAS_MISSION')}</div>
                            <Row className={styles.features}>
                                <div className={`${styles.colMd4} ${styles.feature}`}>
                                    <div className={`ic-ic-exclusive ${styles.featureImage}`}></div>
                                    <div className={styles.featureSubText}>{this.props.t('sales:EXCLUSIVE_IN_VIETNAM')}</div>
                                </div>
                                <div className={`${styles.colMd4} ${styles.feature}`}>
                                    <div className={`ic-ic-globe ${styles.featureImage}`}></div>
                                    <div className={styles.featureSubText}>{this.props.t('sales:DUTY_AND_SHIPPING_FREE')} </div>
                                </div>
                                <div className={`${styles.colMd4} ${styles.feature}`}>
                                    <div className={`ic-ic-ship-filled ${styles.featureImage} ${styles.fixImage}`}></div>
                                    <div className={styles.featureSubText}>{this.props.t('sales:EST_INT_SHIPPING_DAY')}</div>
                                </div>
                            </Row>
                        </div>
                    </Container>
                </div>

                {InternationalCampaignBannerCat && <InternationalCampaignBannerCat />}

                <Container className={`${styles.container} ${styles.internationalContainer}`}>
                    <div className={styles.overseasTitle}>
                        <h4 className={styles.sectionTitle}>{this.props.t('sales:OVERSEAS_BESTSELLERS_TITLE')}</h4>
                        <div className={styles.sectionSeparator}> </div>
                    </div>
                    <Row>
                        {this.props.sales.map((sale: SaleProps, index: number) => (
                            <SaleCard
                                key={index}
                                className={`${styles.colMd6} ${styles.paddingRemove}`}
                                data={sale}
                            />
                        )
                        )}
                    </Row>
                </Container>

                <TrackCategory id={this.props.category} />
                <div className={`${styles.downNavigator} ${this.state.scrollDownVisible ? styles.visible : styles.invisible}`} onClick={this.scrollDown}><i className="ic-ic-arrow-down"></i></div>
            </DefaultLayout>
        );
    }
}

export default translate(['category', 'sales'])(InternationalLayout);
