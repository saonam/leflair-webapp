import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Container, Row, Currency } from '../../../common';

import { CartProduct } from '../cart-product';

import * as styles from './order.scss';

import { OrderProps, ProductProps, getOrder } from '../../../api/orders';

class Order extends Component<any, any> {
  constructor(props: {order: OrderProps, show?: boolean, className?: string, t?: Function}) {
    super(props);

    this.state = {
      show: false,
      order: null
    };

    this.toggle = this.toggle.bind(this);
    this.isReturnable = this.isReturnable.bind(this);
  }

  async toggle() {
    if (!this.state.order) {
      try {
        const order: OrderProps = await getOrder(this.props.order.id);

        this.setState({
          show: !this.state.show,
          order
        });
      } catch(error) {
        console.error(error);
      }
    } else {
      this.setState({
        show: !this.state.show
      });
    }
  }

  isReturnable() {
    this.state.order.products.forEach((p: ProductProps) => {
      if (p.returnable) {
        return true;
      }
    });

    return false;
  }

  componentWillMount() {
    if (this.props.show) {
      getOrder(this.props.order.id)
        .then((order: OrderProps) => {
          this.setState({
            show: this.props.show,
            order
          });
        })
        .catch(console.error);
    }
  }

  render() {
    return (
      <div className={styles.order}>
        <div className={styles.card}>
            <div className={`clearfix ${styles.heading}`} onClick={this.toggle}>
                <div className={styles.title}>
                    {this.props.t('account:ORDER')} #{this.props.order.code}
                </div>
                <div className={`clearfix ${styles.orderStatus}`}>
                    {this.props.order.status && (
                      <span>
                        {this.props.t(`common:${this.props.order.status.toUpperCase()}`)} 
                        <i>{['placed', 'shipped', 'delivered'].indexOf(this.props.order.status) !== -1 && (this.props.order.deliveredDate || this.props.order.shippedDate || this.props.order.createdDate)}</i>
                      </span>
                    )}
                    <i className={`${styles.iconExpand} ic-ic-arrow-down ${this.state.show ? 'ic-ic-arrow-up' : 'ic-ic-arrow-down'}`}></i>
                </div>
            </div>

            {this.state.show && this.state.order && (
              <div className={styles.body}>
                <div className={styles.products}>
                  {this.state.order.products.map((product: ProductProps, index: number) => (
                    <CartProduct className={styles.product} key={index} product={product} />
                  ))}
                </div>

                {/*order detail info*/}
                <Row className={styles.details}>
                    <div className={styles.colLg2}>
                        <div className={styles.detailTitle}>{this.props.t('orders:ORDERED_DATE')}</div>
                        <div className={styles.body}>
                            {this.state.order.createdDate}
                        </div>
                    </div>
                    <div className={styles.colLg4}>
                        <div className={styles.detailTitle}>{this.props.t('orders:SHIPPED_AND_BILLED_TO')}</div>
                        <div className={styles.body}>
                            <div>{[this.state.order.address.shipping.lastName, this.state.order.address.shipping.firstName].join(' ')} <span className={styles.separator}> | </span> {this.state.order.address.shipping.phone}</div>
                            <div>{[this.state.order.address.shipping.address, this.state.order.address.shipping.district, this.state.order.address.shipping.city].join(', ')}</div>
                        </div>
                    </div>
                    <div className={styles.colLg2}>
                        <div className={styles.detailTitle}>{this.props.t('orders:PAID_BY')}</div>
                        <div className={styles.body}>
                            {this.state.order.paymentSummary.method === 'CC' ? (
                              <div>
                                  {this.state.order.paymentSummary.card ? (
                                    <span>{`${this.state.order.paymentSummary.card.type} ending ${this.state.order.paymentSummary.card.lastDigits}`}</span>
                                  ) : (
                                    <span>{this.props.t('orders:CREDIT_CARD')}</span>
                                  )}
                              </div>
                            ) : this.state.order.paymentSummary.method === 'STRIPE' ? (
                              <span>{this.props.t('orders:STRIPE')}</span>
                            ) : 'COD'}
                        </div>
                    </div>
                    <div className={styles.colLg4}>
                        <div className={styles.detailTitle}>{this.props.t('orders:TOTAL')}</div>
                        <Row className="clearfix">
                            <div className={styles.col6}>{this.props.t('orders:SUBTOTAL')}: </div>
                            <div className={`text-right ${styles.col6}`}>
                              <Currency amount = {this.state.order.paymentSummary.subtotal || 0}/>
                            </div>
                        </Row>
                        <Row className="clearfix">
                            <div className={styles.col6}>{this.props.t('orders:SHIPPING')}: </div>
                            <div className={`text-right ${styles.col6}`}>
                              <Currency amount = {this.state.order.paymentSummary.shipping || 0}/>
                            </div>
                        </Row>
                        <Row className="clearfix">
                            <div className={styles.col6}>{this.props.t('orders:CREDITS')}: </div>
                            <div className={`text-right ${styles.col6}`}>
                              <Currency amount = {this.state.order.paymentSummary.accountCredit || 0}/>
                            </div>
                        </Row>
                        <Row className="clearfix">
                            <div className={styles.col6}>{this.props.t('orders:VOUCHER')}: </div>
                            <div className={`text-right ${styles.col6}`}>
                              <Currency amount = {this.state.order.paymentSummary.voucherAmount || 0}/>
                            </div>
                        </Row>
                        <Row className={`clearfix ${styles.total}`} >
                            <div className={styles.col6}>{this.props.t('orders:TOTAL')}: </div>
                            <div className={`text-right ${styles.col6}`}>
                              <Currency amount = {this.state.order.paymentSummary.total || 0}/>
                            </div>
                        </Row>
                    </div>
                </Row>
                <hr />
                <Row className={styles.actions}>
                    <div className={styles.colMd6}>
                        {(['shipped', 'delivered'].indexOf(this.props.order.status) !== -1 && this.state.order.tracking) && <a href={this.state.order.tracking} target="_blank">{this.props.t('orders:VIEW_DELIVERY_STATUS')}<i className={`ic-ic-arrow-right ${styles.externalLink}`}></i></a>}
                    </div>
                    <div className={styles.colMd6}>
                        <span className={styles.text}>{this.props.t(`orders:${this.isReturnable() ? 'ELIGIBLE_TO_RETURN' : 'INELIGIBLE_TO_RETURN'}`)}</span>
                        <a className={`${styles.returnPolicy}`} href="https://support.leflair.vn/hc/en-us/articles/214166108-Details" target="_blank">{this.props.t('orders:VIEW_RETURN_POLICY')}</a>
                    </div>
                </Row>
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default translate(['orders', 'common'])(Order);