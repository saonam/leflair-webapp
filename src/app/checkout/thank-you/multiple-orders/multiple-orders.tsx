import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { Row, Image } from '../../../common';
import { getUser } from '../../../redux/user.redux';
import { OrderProps, ProductProps } from '../../../api/orders';

import * as styles from './multiple-orders.scss';

type MultipleOrdersProps = {
  orders: OrderProps[],
  user: any,
  t?: Function
};

const MultipleOrders: SFC<MultipleOrdersProps> = (props) => (
  <div className={styles.thankYou}>
    <Row>
      <div className={`${styles.col} ${styles.colLg6} text-center`}>
        <h2 className={styles.heading}>- {props.t('THANK_YOU')} -</h2>

        <div className={styles.divideOrders}>
          {props.t('checkout:SUCCESS_DIVIDE_ORDERS', { qty: props.orders.length })}
        </div>

        {props.orders.map((order: OrderProps, index: number) => (
          <div key={index} className={`${styles.order}`}>
            <div className={`${styles.orderHeader} clearfix`}>
              <span className={styles.orderTitle}>
                #<strong>{order.code}</strong> ({order.products.length} {props.t('common:ITEMS')})
              </span>

              <span className={styles.arrive}>
                {props.t('checkout:ARRIVES_IN_NEXT_X_DAYS', order.code.split('-')[0].length === 2 ? { from: 2, to: 7 } : { from: 4, to: 10 })}
              </span>
            </div>

            <div className={styles.orderBody}>
              {order.products.map((product: ProductProps, index2: number) => (
                <div key={index2} className={styles.product}>
                  <Row>
                    <div className={`${styles.col3} ${styles.colMd2} ${styles.productImage}`}>
                      <Image
                        filename={product.image}
                        srcset={[380]}
                        alt={product.title} />
                    </div>

                    <div className={`${styles.col9} ${styles.colMd9} ${styles.productInfo}`}>
                      <div className={styles.productTitle}>{product.title}</div>
                      <span>{props.t('common:QTY')}: {product.quantity}</span>
                    </div>
                  </Row>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className={styles.callYou}>
          {props.t('checkout:SUCESS_CALL_YOU')} <strong>{props.user.email}</strong>
        </div>
      </div>
    </Row>
  </div>
);

export default connect(
  (state) => ({
    user: getUser(state)
  }), {}
)(translate(['common', 'checkout'])(MultipleOrders)) as any;
