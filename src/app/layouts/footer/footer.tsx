import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { Container, Row, Link } from '../../common';

import * as styles from './footer.scss';

const Footer: SFC<any> = (props) => (
    <div className={styles.footerSection} id="footer">
        <Container>
            <div className={styles.upper}>
                <Row>
                    {/*<!-- social links -->*/}
                    <div className={[styles.colMd2, styles.socialLinks].join(' ')}>
                        <Link path="/" className={styles.logo}>
                            <img className={styles.image} src="/images/leflair-white-logo.png" />
                        </Link>

                        <ul className="list-inline">
                            <li className= "list-inline-item">
                                <a href="https://www.facebook.com/LeflairVN" target="_blank">
                                    <i className="ic-facebook"></i>
                                </a>

                            </li>
                            <li className= "list-inline-item">
                                <a href="https://instagram.com/leflairvietnam" target="_blank">
                                    <i className="ic-instagram"></i>
                                </a>
                            </li>
                            <li className= "list-inline-item">
                                <a href="https://www.linkedin.com/company/leflair" target="_blank">
                                    <i className="ic-linkedin2"></i>
                                </a>
                            </li>
                            <li className= "list-inline-item">
                                <a href="https://plus.google.com/+LeflairVn/posts" target="_blank">
                                    <i className="ic-google-plus"></i>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/*contact*/}
                    <div className={[styles.colMd2, styles.col4, styles.contact].join(' ')}>
                        <h4 className={styles.title}>{ props.t('common:CONTACT') }</h4>
                        <div className={styles.body}>

                            <ul className="list-unstyled">
                                <li>
                                    <a className="phone" href="tel:19006710">
                                        19006710
                                    </a>    
                                </li>
                                <li>
                                    <a className="email" href="mailto:help@leflair.vn">
                                        help@leflair.vn
                                    </a>    
                                </li>
                            </ul>

                        </div>
                    </div>

                    {/*<!-- company -->*/}
                    <div className={[styles.colMd2, styles.col4, styles.company].join(' ')}>
                        <h4 className={styles.title}>{props.t('common:COMPANY')}</h4>
                        <div className={styles.body}>

                            <ul className="list-unstyled">
                                <li>
                                    <Link path="/pages/about-us" >
                                       {props.t('page:ABOUT_US')}
                                    </Link>
                                </li>
                                <li>
                                    <a href="http://styleguide.leflair.vn/"  target="_blank" >
                                         {props.t('page:STYLE_GUIDE')}
                                    </a>
                                </li>
                                <li>
                                    <Link path="/pages/partners"target="_blank" >
                                         {props.t('page:PARTNERS_SHORT')}
                                    </Link>
                                </li>
                                <li>
                                    <Link path="/pages/genuine-guarantee" >
                                         {props.t('page:GENUINE_GUARANTEE')}
                                    </Link>
                                </li>
                                <li>
                                    <Link path="/pages/careers" >
                                         {props.t('page:CAREERS')}
                                    </Link>
                                </li>
                            </ul>

                        </div>
                    </div>

                    {/*<!-- customer service -->*/}
                    <div className={[styles.colMd2,styles.col4, styles.customerService].join(' ')}>
                        <h4 className={styles.title}>{props.t('common:CUSTOMER_SERVICE')}</h4>
                        <div className={styles.body}>

                            <ul className="list-unstyled">
                                <li>
                                    <a href="https://support.leflair.vn/hc/en-us" target="_blank" >
                                        {props.t('page:FAQS')}
                                    </a>
                                </li>
                                <li>
                                    <a href="https://support.leflair.vn/hc/en-us/articles/214166108-Details" target="_blank" >
                                        {props.t('page:RETURN_POLICY')}
                                    </a>
                                </li>
                                <li>
                                    <a href="https://support.leflair.vn/hc/en-us/articles/214165808-Terms-Conditions" target="_blank" >
                                        {props.t('page:TERMS_AND_CONDITIONS')}
                                    </a>
                                </li>
                                <li>
                                    <a href="https://support.leflair.vn/hc/en-us/articles/214856317-Details" target="_blank" >
                                        {props.t('page:SHIPPING')}
                                    </a>
                                </li>
                                <li>
                                    <a href="https://support.leflair.vn/hc/en-us/articles/214759757-Will-I-receive-the-VAT-with-my-parcel-" target="_blank">
                                        {props.t('page:TAX')}
                                    </a>
                                </li>
                            </ul>

                        </div>
                    </div>

                    {/*fb page*/}
                    <div className={[styles.colMd4, styles.facebookPage].join(' ')}>
                        <div className="fb-page"
                            data-href="https://www.facebook.com/LeflairVN"
                            data-small-header="true"
                            data-adapt-container-width="true"
                            data-hide-cover="false"
                            data-show-facepile="false"
                            data-show-posts="false">
                        </div>
                    </div>

                </Row>
            </div>

            <div className={styles.lower}>
                <Row>
                    <div className={[styles.colLg8, styles.colMd8].join(' ')}>
                        <Row>
                            <div className={[styles.colLg6, styles.copyright].join(' ')}>
                                <a className={styles.govLink} href="http://www.online.gov.vn/HomePage/CustomWebsiteDisplay.aspx?DocId=19306" target="_blank">
                                    <img className={styles.image} src="/images/stamp-bo-cong-thuong.png" />
                                    
                                </a>
                                <span className={styles.text}>Copyright @ 2017 leflair.vn</span>
                            </div>
                            <div className={[styles.colLg6, styles.address].join(' ')}>
                                {props.t('common:LEFLAIR_ADDRESS')}
                        </div>
                        </Row>
                    </div>

                    <div className={[styles.colLg4, styles.colMd4].join(' ')}>
                        {props.t('common:ISSUER')}
                </div>
                </Row>
            </div>

        </Container>
    </div>
);

export default translate(['page', 'common']) (Footer);