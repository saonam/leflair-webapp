import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { Row } from '../../../common';
import { getUser } from '../../../redux/user.redux';
import { OrderProps, ProductProps } from '../../../api/orders';

import * as styles from './single-order.scss';

type SingleOrderProps = {
  order: OrderProps,
  user: any,
  t?: Function
};

const SingleOrder: SFC<SingleOrderProps> = (props) => (
  <div className={styles.thankYou}>
    <Row>
      <div className={`${styles.col} ${styles.colLg5} text-center`}>
        <h2 className={styles.heading}>- {props.t('THANK_YOU')} -</h2>

        {props.order.status === 'pending' && <div>
          <p>{props.t('checkout:PENDING_CONTENT_1')}</p>

          <p>{props.t('checkout:PENDING_CONTENT_2')} <strong>{props.user.email}</strong></p>
        </div>}

        {props.order.status !== 'pending' && props.order.status !== 'failed' && <div>
          <p>{props.t('checkout:SUCESS_YOUR_ORDER')} <strong>#{props.order.code}</strong> {props.t('checkout:SUCESS_PLACED')}</p>

          <p>{props.t('checkout:SUCESS_EST_TIME')}<strong> 2 - 7 {props.t('common:DAYS')}</strong></p>

          <p>{props.t('checkout:SUCESS_CALL_YOU')} <strong>{props.user.email}</strong></p>
        </div>}
      </div>
    </Row>
  </div>
);

export default connect(
  (state) => ({
    user: getUser(state)
  }), {}
)(translate(['common', 'checkout'])(SingleOrder)) as any;
