import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { Link } from '../../common';

import * as styles from './account-nav.scss';

const  menu: any = [{
    title: 'MY_SETTINGS_SHORT',
    url: '/account/settings'
  }, {
    title: 'MY_ORDERS_SHORT',
    url: '/account/orders'
  }, {
    title: 'MY_ADDRESSES_SHORT',
    url: '/account/addresses'
  }, {
    title: 'MY_CARDS_SHORT',
    url: '/account/cards'
  }];

const AccountNav: SFC<{currentPage: string, t?: Function}> = (props) => (
    <div className={styles.navContainer}>
        <ul className={styles.navWrap}>
            {menu.map((page: any, index: number) =>
                <li key={index} className={styles.navItem}>
                    <Link className={`${styles.navLink} ${props.currentPage === page.title ? styles.active : ''}`} path={page.url} >{props.t('account:' + page.title)}</Link>
                </li>
            )}
        </ul>
    </div>
);

export default translate('account')(AccountNav);