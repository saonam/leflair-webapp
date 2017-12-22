import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { DefaultLayout } from '../layouts';
import { Container, Grid, Row, Image, Link, LazyImage, SectionTitle } from '../common';
import { SubscriptionForm } from '../common/subscription-form';
import  { isBigCampaign } from '../campaign';

import { BestSellers } from './best-sellers';
import { UpcomingSales } from './upcoming-sales';
import { EndTime } from '../sale/end-time';
import { Banner } from './banner';
import { SaleCard } from './sale-card';
import { SecretSaleCamp, SuperBanner } from '../campaign';

import * as styles from './home.scss';

import { SalesProps, SaleProps, UpcomingSaleContentProps, UpcomingSaleProps, BannerProps } from '../api/home';
import { TrackHome } from '../api/rtb-house';
import { isSignedIn, isSubscribed, isSubscriptionClosed } from '../redux/user.redux';
import { getHome, isHomeAvailable, getHomeSales, getHomeBestSellers } from '../redux/home.redux';

type HomeProps = {
  sales: {
    featured: SaleProps,
    current: SaleProps[],
    upcoming: UpcomingSaleContentProps[],
    banners: BannerProps[],
  },
  bestSellers: any[],
  className?: string,
  t?: Function,
  isSignedIn: boolean,
  isSubscribed: boolean,
  isSubscriptionClosed: boolean
};

export const homeAction = async (params: any, cookie: any, store: any) => {
    if (typeof window === 'undefined' || !isHomeAvailable(store.getState())) {
        await store.dispatch(getHome(cookie, store));
    } else {
        store.dispatch(getHome(cookie, store));
    }

    return {
        component: <Home />
    };
};

const CurrentSaleComponent = (props: any) => (
  <Link path={props.data.potd ? `/products/${props.data.slug}` : `/sales/${props.data.slug}`} className={props.className}>
    <div className={styles.currentSale}>
        {(props.data.categories && props.data.categories.indexOf('International') !== -1) && <div className={styles.internationalTile}>{props.t('common:INTERNATIONAL')}</div>}
        <div className={styles.imageWrapper}>
                <LazyImage
                className={styles.currentSaleImg}
                filename={props.data.image}
                srcset={[640, 1080, 1440]}
                sizes={['(max-width: 575px) 100vw', '(max-width: 767px) 540px', '(max-width: 991px) 336px', '(min-width: 992px) 456px', '(min-width: 1200px) 546px', '100vw']}
                alt={props.data.title} 
                lazyLoadImageType={styles.currentSalePlaceholder}/>
        </div>
        <div className={styles.currentSaleInfo}>
            <div className={styles.currentSaleTitle}>{props.data.title}</div>
            <div className={styles.endTimeWrap}>
              <EndTime className={styles.endTimeContent} date={props.data.endTime} />
            </div>
        </div>
    </div>
  </Link>
);

const CurrentSale = translate(['home'])(CurrentSaleComponent);

const HomeComponent: SFC<any> = (props: HomeProps) => (
  <DefaultLayout className={`${styles.defaultLayout} ${typeof window === 'undefined' || props.isSignedIn || props.isSubscriptionClosed || props.isSubscribed ? '' : styles.paddingTopWithBanner} ${isBigCampaign && styles.seasonalLayout}`}>
    {props.sales.featured && <Container className={styles.featuredContainer}>
        <Link path={props.sales.featured.potd ? `/products/${props.sales.featured.slug}` : `/sales/${props.sales.featured.slug}`}>
            <Image
                className="hidden-md-up"
                filename={props.sales.featured.image}
                srcset={[640, 1080, 1440]}
                sizes={['(max-width: 575px) 100vw', '(max-width: 767px) 540px', '100vw']}
                alt={props.sales.featured.title} />
            <Image
                className="hidden-sm-down"
                filename={props.sales.featured.image2}
                srcset={[850, 1440, 2560]}
                sizes={['(max-width: 575px) 100vw', '(max-width: 767px) 540px', '100vw']}
                alt={props.sales.featured.title} />
            <div className={`hidden-md-up ${styles.badge} ${styles.featuredBadge}`}>{props.t('home:FEATURED_TITLE')}</div>
            <div className={`hidden-md-up ${styles.currentSaleInfo}`}>
                <div className={styles.currentSaleTitle}>{props.sales.featured.title}</div>
                <div className={styles.endTimeWrap}>
                  <EndTime className={styles.endTimeContent} date={props.sales.featured.endTime} />
                </div>
            </div>
        </Link>
    </Container>}
    <Container className={styles.homeContainer}>
        <div className={styles.topShadow}></div>
        
        <SectionTitle
            title={props.t('home:CURRENT_SALES')}
            className={styles.currentSaleSectionTitle}
        />

        <SecretSaleCamp />
        <Banner data={props.sales.banners} className={styles.bannerWrap}/>  
        
        <Row>
            {props.sales.current.map((item: any, index: number) => 
                <CurrentSale className={`${styles.colMd6} ${styles.paddingRemove}`} key={index} data={item} />
            )}
        </Row>     
        
        <BestSellers className={styles.bestSellers} bestSellers={props.bestSellers} isHomeSale={true}/>

        <SectionTitle
            title={props.t('home:UPCOMING_SALES')}
            className={styles.upSaleSectionTitle}
        />
        <UpcomingSales data={props.sales.upcoming} />
    </Container>

    {!props.isSubscribed && !props.isSignedIn && <div className={`${styles.subscriptionContainer} ${props.isSubscribed ? styles.fadeOut : ''}`}>
      <Container>
        <SubscriptionForm
          title={props.t('subscription:SUBSCRIPTION_TITLE')}
          subTitle={props.t('subscription:SUBSCRIPTION_SUBTEXT')}
          thankYouSub={props.t('subscription:THANK_YOU_SUB')}
          className={styles.contentWrap}
          />
      </Container>
    </div>}
    
    <TrackHome />
  </DefaultLayout>
);

const Home = connect(
  (state) => ({
    isSignedIn: isSignedIn(state),
    isSubscribed: isSubscribed(state),
    isSubscriptionClosed: isSubscriptionClosed(state),
    sales: getHomeSales(state),
    bestSellers: getHomeBestSellers(state)
  })
)(translate(['home', 'subscription'])(HomeComponent));

export default Home;
