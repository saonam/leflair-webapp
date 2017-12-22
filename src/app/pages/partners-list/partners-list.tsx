import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { connect } from 'react-redux';
import { isSignedIn, isSubscribed } from '../../redux/user.redux';

import { DefaultLayout } from '../../layouts';
import { Container, Row } from '../../common';
import { SubscriptionForm } from '../../common/subscription-form';

import * as styles from './partners-list.scss';

export const partnersCitibankAction = () => ({
    component: <PartnersList topBanner={<CitiBank />} termCondition={<CitiTermCondition />} citiBankBottomContent={<CitiBankBottomContent />}></PartnersList>
});

export const partnersVPBankAction = () => ({
    component: <PartnersList topBanner={<VPBank />} termCondition={<VPBankTermCondition />} ></PartnersList>
});

export const partnersMasterCardAction = () => ({
    component: <PartnersList topBanner={<MasterCard />} termCondition={<MastercardTermCondition />} ></PartnersList>
});

let termConditionSectionDiv: Element = null;

type PartnerProps = {
    topBanner: any,
    termCondition?: any,
    citiBankBottomContent?: any,
    partnerName: string,
    t?: Function,
    isSignedIn: boolean,
    isSubscribed: boolean
};

const goToTermCondition = (elem: Element) => {
    const classNames = elem.className.split(' ');
    window.scrollTo(0, elem.getBoundingClientRect().top + window.scrollY - 46);
};

const CitiBank = (props: any) => (
    <Row>
        <div className={`${styles.colLg6} ${styles.section1} ${styles.section1Text}`}>
            <h1 className={styles.title}>Dành riêng cho <br />chủ thẻ tín dụng Citi</h1>
            <p className={styles.body}>Từ ngày 27 đến 29 hàng tháng, <strong>hoàn tiền 5%</strong> dành cho chủ thẻ tín dụng Citi khi mua sắm tại Leflair.</p>
            <a className={styles.goToTerm} href="javascript:void(0)" onClick={() => goToTermCondition(termConditionSectionDiv)}>Điều khoản & Điều kiện áp dụng</a>
        </div>
        <div className={`${styles.colLg6} ${styles.section1} ${styles.section1Img}`}>
            <img className={styles.img} src="/images/partners/citibank-cards.png" />
        </div>
    </Row>
);

const VPBank = (props: any) => (
    <Row>
        <div className={`${styles.colLg6} ${styles.section1} ${styles.section1Text}`}>
            <h1 className={styles.title}>Áp dụng riêng cho<br />chủ thẻ VPBank</h1>
            <p className={styles.body}>
                <strong>Giảm 150.000 VND </strong>
                khi mua sắm từ 1.500.000 VND trên Leflair*.
                <br /> Nhập code <strong>VPBANK150</strong>
            </p>
            <p>(*Cho mỗi thứ 2 hàng tuần)</p>
            <a className={styles.goToTerm} href="javascript:void(0)" onClick={() => goToTermCondition(termConditionSectionDiv)}>Điều khoản & Điều kiện áp dụng</a>
        </div>
        <div className={`${styles.colLg6} ${styles.section1} ${styles.section1Img}`}>
            <img className={styles.img} src="/images/partners/partner-vbbank.png" />
        </div>
    </Row>
);

const MasterCard = (props: any) => (
    <Row>
        <div className={`${styles.colLg6} ${styles.section1} ${styles.section1Text}`}>
            <h1 className={styles.title}>Dành riêng cho <br />chủ thẻ HSBC Mastercard</h1>
            <p className={styles.body}><strong>Giảm 10%</strong> cho đơn hàng từ 1.000.000 VND trên Leflair*.
                <br /> Nhập code <strong>MASTERCARD10</strong>
            </p>
            <p>(*Cho mỗi thứ 5 hàng tuần)</p>
            <a className={styles.goToTerm} href="javascript:void(0)" onClick={() => goToTermCondition(termConditionSectionDiv)}>Điều khoản & Điều kiện áp dụng</a>
        </div>
        <div className={`${styles.colLg6} ${styles.section1} ${styles.section1Img}`}>
            <img className={styles.img} src="/images/partners/partner-mastercard.png" />
        </div>
    </Row>
);

const CitiBankBottomContent = () => (
    <div className={`${styles.colLg6} ${styles.colMd10} ${styles.offsetLg3} ${styles.offsetMd1} ${styles.sectionMoreInfo}`}>
        <div className={styles.text}>Bạn chưa có thẻ  tín dụng Citi? Hãy đăng ký mở thẻ để nhận voucher của Leflair trị giá 1,000,000đ và các quà tặng giá trị khác để sắm hàng hiệu tại Leflair!</div>
        <div className={styles.image}>
            <a className={`${styles.btn} ${styles.btnPrimary}`} href="https://www.citibank.com.vn/leflair" target="blank" >Đăng Ký Ngay</a>
        </div>
    </div>
);

const CitiTermCondition = () => (
    <div className={`${styles.colLg6} ${styles.colMd10} ${styles.offsetLg3} ${styles.offsetMd1} ${styles.termCondition}`}>
        <h3 className={styles.title}>Điều khoản và Điều kiện</h3>
        <ul className={styles.list}>
            <li>Ưu đãi chỉ áp dụng cho những sản phẩm có tại www.leflair.vn.</li>
            <li>Ưu đãi không áp dụng kèm với những ưu đãi khác đang có tại Leflair.</li>
            <li>Chí áp dụng từ ngày 27 đến 29 mỗi tháng trong thời gian diễn ra chương trình.</li>
            <li>Trong vòng 7 ngày sau khi hết thời gian cashback, Leflair sẽ gửi thông tin số tiền credit cho khách hàng thông qua ví điện tử tại leflair.vn. </li>
        </ul>
    </div>
);

const MastercardTermCondition = () => (
    <div className={`${styles.colLg6} ${styles.colMd10} ${styles.offsetLg3} ${styles.offsetMd1} ${styles.termCondition}`}>
        <h3 className={styles.title}>Điều khoản và Điều kiện</h3>
        <ul className={styles.list}>
            <li>Ưu đãi chỉ áp dụng cho những sản phẩm có tại www.leflair.vn.</li>
            <li>Code không áp dụng kèm với những ưu đãi khác đang có tại Leflair.</li>
            <li>Chí áp dụng vào mỗi ngày Thứ Năm trong suốt thời gian diễn ra ưu đãi.</li>
            <li>Khách hàng nhập mã code tại bước Thanh Toán. Code chỉ có hiệu lực khi thanh toán bằng thẻ HSBC Vietnam Premier Mastercard.</li>
        </ul>
    </div>
);

const VPBankTermCondition = () => (
    <div className={`${styles.colLg6} ${styles.colMd10} ${styles.offsetLg3} ${styles.offsetMd1} ${styles.termCondition}`}>
        <h3 className={styles.title}>Điều khoản và Điều kiện</h3>
        <ul className={styles.list}>
            <li>Ưu đãi chỉ áp dụng cho những sản phẩm có tại www.leflair.vn.</li>
            <li>Code không áp dụng kèm với những ưu đãi khác đang có tại Leflair.</li>
            <li>Chí áp dụng vào mỗi ngày Thứ Hai trong suốt thời gian diễn ra ưu đãi.</li>
            <li>Khách hàng nhập mã code tại bước Thanh Toán. Code chỉ có hiệu lực khi thanh toán bằng thẻ VPBank.</li>
        </ul>
    </div>
);

const PartnersListComp: SFC<PartnerProps> = (props) => {
    return (
        <DefaultLayout>
            <div className={styles.sectionContainer}>
                <Container>
                    {props.topBanner}
                </Container>
            </div>
    
            <Row className={styles.sectionBuy}>
                <div className={styles.colMd6}>
                    <a className={`${styles.buyWrap} ${styles.women}`} href="./Women">
                        <div className={`${styles.ctaWrap} ${styles.ctaWomen}`}>
                            <div className={styles.title}>Nữ</div>
                            <div className={`${styles.cta}`} >MUA HÀNG <span className={`ic-ic-arrow-right ${styles.icon}`}></span> </div>
                        </div>
                    </a>
                </div>
                <div className={styles.colMd6}>
                    <a className={`${styles.buyWrap} ${styles.men}`} href="./Men">
                        <div className={`${styles.ctaWrap} ${styles.ctaMen}`}>
                            <div className={styles.title}>Nam</div>
                            <div className={`${styles.cta}`} >MUA HÀNG <span className={`ic-ic-arrow-right ${styles.icon}`}></span> </div>
                        </div>
                    </a>
                </div>
            </Row>

            <div ref={termConditionSection => termConditionSectionDiv = termConditionSection}>
                {props.termCondition && <Container>
                    {props.termCondition}
                </Container>}
            </div>
    
            {props.citiBankBottomContent && <Container>
                {props.citiBankBottomContent}
            </Container>}
    
            {!props.isSubscribed && !props.isSignedIn && <div className={`${styles.subscriptionContainer}`}>
                <Container>
                    <SubscriptionForm
                        subTitle={props.t('subscription:SUBSCRIPTION_SUBTEXT')}
                        thankYouSub={props.t('subscription:THANK_YOU_SUB')}
                        className={styles.contentWrap}
                    />
                </Container>
            </div>}
    
        </DefaultLayout>
    );
}
    

const PartnersList = connect(
    (state) => ({
        isSignedIn: isSignedIn(state),
        isSubscribed: isSubscribed(state)
    })
)(translate('common')(PartnersListComp) as any) as any;
