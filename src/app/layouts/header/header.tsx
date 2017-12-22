import * as React from 'react';
import { SFC, Component, ReactElement } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { Container, Row, Link, Button, Alert } from '../../common';
import { getUser, isSignedIn, getAccountCredit, signOut, isSubscribed, isSubscriptionClosed, closeSubscription } from '../../redux/user.redux';
import { getCartSize } from '../../redux/cart.redux';
import { getCategories } from '../../redux/categories.redux';
import { setAlert } from '../../redux/alert.redux';
import { CategoryProps } from '../../api/categories';

import { toggleNavbar } from '../toggler';
import { Logo } from './logo-collection';
import { LanguageDropdown } from './language-dropdown';
import { CartButton } from './cart-button';
import { MyAccountDropdown } from './my-account-dropdown';
import { AuthButtons } from './auth-buttons';
import { SubscriptionBanner} from './subscription-banner';

import * as styles from './header.scss';

// header component

type HeaderProps = {
  user: any,
  isSignedIn: boolean,
  accountCredit: number,
  signOut: Function,
  cartSize: number,
  categories: CategoryProps[],
  t?: Function,
  isSubscribed: boolean,
  isSubscriptionClosed: boolean,
  closeSubscription: Function,
};

class Header extends Component<any, any> {
  constructor(props: HeaderProps) {
    super(props);
  }

  render() {
    const pathname = typeof window !== 'undefined' ? location.pathname.replace('/', '') : null;
    const isHome = pathname === '';
    const isCategoriesNavVisible = isHome || this.props.categories.some((category: CategoryProps) => pathname === category.id);

    return (
      <div className={styles.header} id="header">
        {isHome && !this.props.isSignedIn && !this.props.isSubscriptionClosed && !this.props.isSubscribed && <SubscriptionBanner  onClose={this.props.closeSubscription} />}

        <nav className={[styles.myNavbar, styles.navbarToggleableSm].join(' ')}>
          <Container className={styles.container}>
            <div className={`hidden-md-up ${styles.myNavbarToggler}`}>
              <Button className={styles.btnIcon} type="button" onClick={toggleNavbar}>
                <i className="ic-ic-user"></i>
              </Button>
            </div>

            <Link className={styles.navbarBrand} path="/">
              <Logo />
            </Link>

            <div className={`clearfix collapse ${styles.navbarCollapse}`}>
              <Link className={`hidden-md-up ${styles.navbarBrand}`} path="/">
                <img src="/images/leflair-logo-black.png" />
              </Link>

              {/* desktop categories */}
              <CategoriesNav className={`hidden-md-down ${styles.navbarNav} ${styles.navbarLeft}`} categories={this.props.categories} />

              <ul className={`${styles.navbarNav} ${styles.navbarRight}`}>
                <li className={styles.navItem}>
                  <LanguageDropdown />
                </li>

                {this.props.isSignedIn ? (
                  <li className={styles.navItem}>
                    <MyAccountDropdown accountCredit={this.props.accountCredit} signOut={this.props.signOut} />
                  </li>
                ) : (
                    <li className={styles.navItem}>
                      <AuthButtons />
                    </li>)
                }
              </ul>
            </div>
            <CartButton cartSize={this.props.cartSize} />
          </Container>
        </nav>

        {/* mobile categories */}
        {isCategoriesNavVisible && <nav className={`hidden-lg-up ${styles.mobileNavCatContainer}`} id="cate-mobile-root">
          <Container className={styles.paddingRemove}>
            <CategoriesNav className={styles.mobileNavCat} categories={this.props.categories} />
          </Container>
        </nav>}

        <Alert />

      </div>
    );
  }
  
};

export default translate(['page', 'common'])(connect(
  (state: any) => ({
    user: getUser(state),
    isSignedIn: isSignedIn(state),
    accountCredit: getAccountCredit(state),
    cartSize: getCartSize(state),
    categories: getCategories(state),
    isSubscribed: isSubscribed(state),
    isSubscriptionClosed: isSubscriptionClosed(state),
  }), {
    signOut,
    closeSubscription,
    setAlert
  }
)(Header as any));


// categories nav component

type CategoriesNavProps = {
  categories: CategoryProps[],
  className?: string,
  t?: Function
};

class CategoriesNavComponent extends Component<any, any> {
  constructor(props: CategoriesNavProps) {
    super(props);
    
    this.state = {
      activeCategory: typeof window !== 'undefined' ? location.pathname.replace('/', '') || 'All' : null
    };

    this.selectCategory = this.selectCategory.bind(this);
  }

  selectCategory(category: string) {
    this.setState({
      activeCategory: category
    });
  }

  render() {
    return (
      <ul className={this.props.className || ''}>
        {/* <CategoryNavItem
          isActive={'All' === this.state.activeCategory}
          onClick={() => this.selectCategory('All')}
          path="/"
          title={this.props.t(`category:All`)}
        /> */}

        {this.props.categories.map((category: CategoryProps, index: number) => (
          <CategoryNavItem
            key={index}
            isActive={category.id === this.state.activeCategory}
            onClick={() => this.selectCategory(category.id)}
            path={`/${category.id}`}
            title={this.props.t(`category:${category.title}`)}
          />
        ))}
      </ul>
    );
  }
}

const CategoriesNav = translate(['category'])(CategoriesNavComponent);


// category nav item

type CategoryNavItemProps = {
  isActive: boolean,
  onClick: Function,
  path: string,
  title: string,
  t?: Function
};

const CategoryNavItemComponent: SFC<CategoryNavItemProps> = (props) => (
  <li className={styles.navItem}>
    {props.title === props.t('International') ? <div className={styles.newIndicator}>{props.t('category:NEW')}</div> : null}
    <Link
      className={`${styles.navLink} ${props.isActive ? styles.activeSelector : ''}`}
      onClick={props.onClick}
      path={props.path}
    >
      {props.title}
    </Link>
  </li>
);

const CategoryNavItem = translate(['category'])(CategoryNavItemComponent);
