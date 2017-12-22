import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { connect } from 'react-redux';
import { isSignedIn, isSubscribed } from '../../redux/user.redux';

import { DefaultLayout } from '../../layouts';
import { Container, Row, Currency } from '../../common';
import { SubscriptionForm } from '../../common/subscription-form';

import * as styles from './secret-sales.scss';

export const secretSalesCompAction = () => {
  const SecretSales = translate('subscription')(connectedSecretSalesComp);

  return {
    component: <SecretSales />
  };
};

const products: any = [{
    name: 'Túi Tote Dolce Vita Furla',
    img: '/images/secret-sale/secret-sale-product-furla-1.jpg',
    retailPrice: 17700000,
    salePrice: 8639000
},{
    name: 'Túi Crossbody Alice Furla',
    img: '/images/secret-sale/secret-sale-product-furla-2.jpg',
    retailPrice: 21500000,
    salePrice: 10449000
},{
    name: 'Kính mát nữ Butterfly Tom Ford',
    img: '/images/secret-sale/secret-sale-product-glass-tomford.jpg',
    retailPrice: 7800000,
    salePrice: 3599000
},{
    name: 'Kính Mát Nữ Oval Đính Đá Salvatore Ferragamo',
    img: '/images/secret-sale/secret-sale-product-glass-salvatore-ferragamo.jpg',
    retailPrice: 5900000,
    salePrice: 2499000
},{
    name: 'Son môi Veiled Rouge Shiseido',
    img: '/images/secret-sale/secret-sale-product-shiseido.jpg',
    retailPrice: 825000,
    salePrice: 599000
},{
    name: 'Bộ dưỡng da Clarins',
    img: '/images/secret-sale/secret-sale-product-clarins.jpg',
    retailPrice: 3445000,
    salePrice: 1489000
},{
    name: 'Đồng hồ nữ Glitz 2 Tonen DKNY',
    img: '/images/secret-sale/secret-sale-product-dkny.jpg',
    retailPrice: 4700000,
    salePrice: 2519000
},{
    name: 'Vòng tay Double Heart',
    img: '/images/secret-sale/secret-sale-product-double-heart.jpg',
    retailPrice: 1630000,
    salePrice: 589000
}];

const ProductTileComp = (props: any) => (
    <div className={`${props.className || ''} ${styles.colMd6} ${styles.productTile}`} key={props.key}>
        <div className={styles.productImgWrap}>
            <img src={props.product.img} alt={props.product.img}/>
        </div>
        <h3 className={styles.productTitle}>{props.product.name}</h3>
        <div className={styles.pricesWrap}>
            <Currency className={styles.retailPrice} amount={props.product.retailPrice} />
            <Currency className={styles.salePrice} amount={props.product.salePrice} />
        </div>
    </div>
);
const SecretSalesComp: SFC<any> = (props) => (
    <DefaultLayout>
        <div className={styles.sectionContainer}>
            <Container>
                <Row>
                    <div className={`${styles.colMd9} ${styles.section1} ${styles.section1Text}`}>
                        <h1 className={styles.title}>{props.t('subscription:SCR_MAIN_TITLE')}<br/>
                        <span className={styles.underLine}>{props.t('subscription:SCR_MAIN_TITLE_2')}</span> 
                        </h1>

                        <div className={styles.saleAmountWrap}>
                            <div className={styles.saleDesc}>{props.t('subscription:SCR_SALE_UP_TO')}</div>
                            <div className={styles.saleAmount}>90 <span className={styles.percent}>%</span></div>
                            <div className={styles.saleDesc}>28/10 - 31/10</div>
                        </div>
                        <div className={`${styles.subWrap} ${styles.colLg8} ${styles.colMd10}`}>
                            <div className={styles.subTitle}>{props.t('subscription:SCR_SUBSCRIBE_BOTTOM_TITLE')}</div>
                            <SubscriptionForm
                                context="SECRET_SALES_PAGE_TOP_FORM"
                                thankYouSub={props.t('subscription:THANK_YOU_SUB')}
                            />
                        </div>
                    </div>
                </Row>
            </Container>
        </div>

        <div className={styles.brandsSection}>
            <Container>
                <h2>{props.t('subscription:SCR_MORE_THAN_BRANDS')}</h2>
                <Row>
                    <div className={`${styles.imgWrap} ${styles.colMd10} ${styles.offsetMd1}`}>
                        <img className={styles.img} src="/images/secret-sale/brands-sheet.png" />
                    </div>
                </Row>
            </Container>
        </div>

        <Container className={styles.productListSection}>
            <h2>{props.t('subscription:SCR_PICKED_PRODUCTS')}</h2>
            <Row>
                { products.map((product: any, key: number) => (
                    <ProductTileComp
                        key={key}
                        product={product} />
                )) }
            </Row>
            <div className={styles.andMoreProducts}>{props.t('subscription:SCR_MORE_PRODUCTS')}</div>
        </Container>

        {!props.isSubscribed && !props.isSignedIn && <Container className={styles.removePadding}>
                <div className={styles.subsContainer}>
                    <div className={styles.subsTitle}>{props.t('subscription:SCR_WANT_ACCESS')}</div>
                    <div className={styles.subsDesc}>{props.t('subscription:SCR_SUBSCRIBE_NOW')}</div>
                    <SubscriptionForm
                        context="SECRET_SALES_PAGE_BOTTOM_FORM"
                        thankYouSub={props.t('subscription:THANK_YOU_SUB')}
                        darkTheme={true}
                        className={`${styles.colLg6} ${styles.colMd8}`}
                    />
                </div>
            </Container> }

    </DefaultLayout>
);

const connectedSecretSalesComp = connect(
    (state) => ({
      isSignedIn: isSignedIn(state),
      isSubscribed: isSubscribed(state)
    })
  )(SecretSalesComp as any);
