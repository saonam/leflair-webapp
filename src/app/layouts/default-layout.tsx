import * as React from 'react';
import { SFC } from 'react';
import { connect } from 'react-redux';

import LoadingBar from 'react-redux-loading-bar';

import MasterLayout from './master-layout';
import { Container, Link } from '../common';

import { Footer } from './footer';
import { Header } from './header';
import { Cart } from './cart';
import { Backdrop } from './backdrop';
import { GoToTop } from './go-to-top';
import { Preview } from './preview';

import { isAllowedPreview } from '../redux/user.redux';

import * as styles from './default-layout.scss';

type DefaultLayoutProps = {
  isAllowedPreview?: boolean,
  className?: string,
  children?: any
};

const DefaultLayout: SFC<DefaultLayoutProps> = (props) => (
  <MasterLayout>
    <LoadingBar className="loading-bar" style={{ position: 'fixed', zIndex: 10002, backgroundColor: '#0EC0E8', height: 3 }} updateTime={100} maxProgress={99.5} progressIncrease={99.5} />
    <div className={`${styles.container} ${props.className}`}>
      <Backdrop />

      <Header />

      { props.children }

      <Footer />

      <Cart />

      <GoToTop />

      {props.isAllowedPreview && <Preview />}
    </div>
  </MasterLayout>
);

export default connect((state) => ({
  isAllowedPreview: isAllowedPreview(state)
}))(DefaultLayout) as any;
