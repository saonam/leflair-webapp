import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { DefaultLayout } from '../../layouts';
import { AccountNav } from '../account-nav';
import { Container, Row } from '../../common';

import { FilterDropdown } from './filter-dropdown';
import { Order } from './order';

import * as styles from './orders.scss';

import { OrderProps, getOrders } from '../../api/orders';

export const ordersAction = async (params?: any, cookie?: any) => {
  const orders = await getOrders(cookie);

  return {
    component: <Orders orders={orders} />
  };
};

class OrdersComponent extends Component<any, any> {
    constructor(props: { orders: OrderProps[], className?: string, t?: Function }) {
      super(props);

      const selectedFilter = 'ALL_ORDERS';
      this.state = {
        selectedFilter,
        filteredOrders: this.filterOrders(selectedFilter)
      };

      this.onSelectFilter = this.onSelectFilter.bind(this);
      this.filterOrders = this.filterOrders.bind(this);
    }

    onSelectFilter(option: string) {
      this.setState({
        selectedFilter: option,
        filteredOrders: this.filterOrders(option)
      });
    }

    filterOrders(option: string) {
      const openedList: string[] = ['pending', 'placed', 'confirmed', 'shipped'];
      switch(option) {
        case 'OPEN_ORDERS': 
          return this.props.orders.filter((order: OrderProps) => openedList.indexOf(order.status) > -1);
        case 'PAST_ORDERS':
          return this.props.orders.filter((order: OrderProps) => openedList.indexOf(order.status) < 0);
        default:
          return this.props.orders.slice();
      }
    }

    render() {
        return (
            <DefaultLayout>
                <Container>
                    <div className={styles.pageContainer}>
                        <Row>
                            <div className={`${styles.colMd3} ${styles.navSection}`}>
                                <AccountNav currentPage="MY_ORDERS_SHORT" />
                            </div> 

                            <div className={`${styles.colMd9} ${styles.col12}`}>
                                <div className={styles.container}>
                                    <h3 className={styles.pageTitle}>{this.props.t('account:MY_ORDERS')}</h3>

                                    <div className={styles.ordersSection}>
                                        <FilterDropdown
                                          currentSelected={this.state.selectedFilter}
                                          onSelect={this.onSelectFilter} />

                                        {!this.state.filteredOrders.length ? (
                                          <div className={styles.emptyDesc}>{this.props.t(`account:${this.state.selectedFilter === 'OPEN_ORDERS' ? 'NO_OPEN_ORDERS' : this.state.selectedFilter === 'PAST_ORDERS' ? 'NO_PAST_ORDERS' : 'NO_ORDERS'}`)}</div>
                                        ) : this.state.filteredOrders.map((order: OrderProps, index: number) => (
                                          <Order key={index} order={order} show={index === 0} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Row>
                    </div>
                </Container>
            </DefaultLayout>
        )
    }
}

const Orders = translate('account')(OrdersComponent);
