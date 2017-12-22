import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { Link } from '../../common';

import * as styles from './pages-nav.scss';

const pages: any = [{
    name: 'ABOUT_US',
    url: '/pages/about-us'
}, {
    name: 'GENUINE_GUARANTEE',
    url: '/pages/genuine-guarantee'
}, {
    name: 'PARTNERS',
    url: '/pages/partners'
}, {
    name: 'CAREERS',
    url: '/pages/careers'
}];

const PagesNav: SFC<any> = (props: {currentPage: string, t: Function}) => (
    <div className={styles.navContainer}>
        <ul className={styles.nav}>
            {pages.map((page: any, index: number) =>
                <li key={index} className={styles.navItem}>
                    <Link className={`${styles.navLink} ${props.currentPage === page.name ? styles.active : ''}`} path={page.url} >{props.t('page:' + page.name)}</Link>
                </li>
            )}
        </ul>
    </div>
);

export default translate(['page'])(PagesNav);