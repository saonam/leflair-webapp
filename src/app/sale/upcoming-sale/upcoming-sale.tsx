import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { DefaultLayout } from '../../layouts';
import { Container, Row, Grid, Breadcrumb } from '../../common';
import { SubscriptionForm } from '../../common/subscription-form';
import { history } from '../../router';

import { Timer } from '../timer';

import * as styles from './upcoming-sale.scss';

import { getUpcomingSale } from '../../api/upcoming-sale';
import { isSignedIn, isSubscribed } from '../../redux/user.redux';

export const upcomingSaleAction = async (params: any, cookie?: any, store?: any) => {
  try {
    const saleId = /([\w]+)$/.exec(params.saleId)[1];
    const sale = await getUpcomingSale(saleId, store);

    // check if the sale has started
    if (sale.isStarted) {
      // then redirect to sales/product page
      history.replace(`/${sale.potd ? 'products' : 'sales'}/${sale.slug}`);
      return;
    }

    const ConnectedUpcomingSale = connect(
      (state) => ({
        isSignedIn: isSignedIn(state),
        isSubscribed: isSubscribed(state),
        sale
      })
    )(UpcomingSaleComponent);
    const UpcomingSale = translate(['common','subscription'])(ConnectedUpcomingSale);

    return {
      component: <UpcomingSale />,
      meta: {
        title: sale.title,
        description: sale.description,
        image: `w1080/q90/${sale.image}`
      }
    };
  } catch (error) {
    // redirect to home if sale is ended
    history.replace('/');

    return;
  }
};

const UpcomingSaleComponent: SFC<any> = (props) => {
  const imageStyles = (image: string): any => {
    return {
      backgroundImage: `url(//images.leflair.vn/w1440/q90/${props.sale.image})`
    };
  };

  return (
    <DefaultLayout>
      <Container>
        <div className={styles.upcomingSale}>
          <div className={styles.saleHeader}>
            <div className={`clearfix ${styles.headerTop}`}>
              <Breadcrumb className={styles.breadcrumb} build={{ sale: props.sale }} />
            </div>

            <div className={styles.headerBottom}>
              <div className={styles.timerContainer}>
                <i className={`${styles.icon} ic-ic-time`}></i> <span className={styles.text}>{props.t('common:STARTING_IN')}</span> <span className={styles.timer}>
                  <Timer time={props.sale.startTime} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container className={styles.saleContent}>
          <div className={styles.image} style={imageStyles(props.sale.image)}></div>
          <div className={styles.overlay}>
            <h1 className={styles.title}>{props.sale.title}</h1>
            <div className={styles.desc}>{props.sale.description}</div>
            
            {!props.isSubscribed && !props.isSignedIn && <SubscriptionForm
              title2 = {props.t('subscription:UPCOMING_SALE_SUBTEXT')}
              thankYouSub = {props.t('subscription:THANK_YOU_SUB_UPCOMMING')}
              className = {styles.subBox}
              context = "Upcoming Sale"
            />}
          </div>
      </Container>
    </DefaultLayout>
  )
};
