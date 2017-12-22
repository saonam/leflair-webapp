import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { Container } from '../../common';
import { LanguageDropdown } from './language-dropdown';

import * as styles from './header.scss';

const LandingpageHeader: SFC<{}> = (props) =>{
    return (
        <div className={styles.header} id='landingpage-header'>
            <nav className={`${styles.myNavbar} ${styles.navbarToggleableSm}`}>
                <Container className={`${styles.headerContainer} clearfix`}>
                    <a className={`${styles.navbarBrand} checkout`} href="/" target="_blank">
                        <img src="/images/leflair-logo-black.png" />
                    </a>

                    <ul className={`${styles.navbarNav} ${styles.navbarRight}`}>
                    <li className={styles.navItem}>
                        <LanguageDropdown />
                    </li>
                    </ul>
                </Container>
            </nav>
        </div>
    );
};

export default translate('common')(LandingpageHeader);
