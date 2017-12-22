import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Container, Row, SubscriptionForm } from '../../../common';

import * as styles from './subscription-banner.scss';

class SubscriptionBanner extends Component<any, any> {
    constructor(props: { title?: string, title2?: string, subTitle?: string, thankYouSub?: string, className?: string, onClose: Function }) {
      super(props);

      this.state = {
        expand: false
      }

      this.handleExpand = this.handleExpand.bind(this);
      this.handleCollapse = this.handleCollapse.bind(this);
    }

    handleExpand() {
      this.setState({
        expand: true
      });
    }

    handleCollapse() {
      this.setState({
        expand: false
      });
    }

    render() {
        return(
             !this.state.hide && <div id="subscription-top-banner">
                {<div className={`${styles.subBannerSection} ${this.state.expand ? styles.expand : '' }`} >
                    <Container>
                        { !this.state.expand && <div className={styles.bannerCollapseWrap}>
                            <div className={styles.textTitle} onClick= {this.handleExpand}>
                                {this.props.t('subscription:HOW_WE_DIFF')}
                                <span className={styles.textLink} >{this.props.t('subscription:SHOW_ME')}</span>
                            </div>
                        </div> }

                        { this.state.expand && <div className={styles.bannerExpandWrap}>
                            <div className={styles.rowWrapOuter}>
                                <Row className={styles.rowWrapInner}>
                                    <div className={`${styles.col4} ${styles.section}`}>
                                        <div className={`${styles.icon} ic-ic-home-sale`}></div>
                                        <div className={styles.sectionTitle}>
                                            {this.props.t('subscription:SUB_HOME_BANNER_TITLE_1')}
                                        </div>
                                        <div className={styles.sectionSubTitle}>
                                            {this.props.t('subscription:SUB_HOME_BANNER_CONTENT_1')}
                                        </div>
                                    </div>
                                    <div className={`${styles.col4} ${styles.section}`}>
                                        <div className={`${styles.icon} ic-ic-guarantee`}></div>
                                        <div className={styles.sectionTitle}>
                                            {this.props.t('subscription:SUB_HOME_BANNER_TITLE_2')}
                                        </div>
                                        <div className={styles.sectionSubTitle}>
                                            {this.props.t('subscription:SUB_HOME_BANNER_CONTENT_2')}
                                        </div>
                                    </div>
                                    <div className={`${styles.col4} ${styles.section}`}>
                                        <div className={`${styles.icon} ic-ic-home-new`}></div>
                                        <div className={styles.sectionTitle}>
                                            {this.props.t('subscription:SUB_HOME_BANNER_TITLE_3')}
                                        </div>
                                        <div className={styles.sectionSubTitle}>
                                            {this.props.t('subscription:SUB_HOME_BANNER_CONTENT_3')}
                                        </div>
                                    </div>

                                </Row>
                            </div>
                            <div className={`${styles.colLg6} ${styles.offsetLg3} ${styles.mailBoxWrap}`}>
                                <SubscriptionForm
                                  title2={this.props.t('subscription:HOMEPAGE_TOP_SUBTEXT')}
                                  thankYouSub={this.props.t('subscription:THANK_YOU_SUB')}
                                  darkTheme={true} />
                                <span className={styles.continueShopping} onClick= {this.handleCollapse} >{this.props.t('common:CONTINUE_SHOPPING')}</span>
                            </div>

                        </div> }
                        {!this.state.expand && <span className={`${styles.iconClose} ic-ic-close`} onClick= {this.props.onClose} ></span>}
                        { this.state.expand && <span className={`${styles.iconCollapse} ${this.state.expand ? styles.show : '' } ic-ic-close`} onClick= {this.props.onClose} ></span>} 
                    </Container>

                </div>}
            </div>
        )
    }
}

export default translate(['subscription', 'common'])(SubscriptionBanner);
