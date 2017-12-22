import * as React from 'react';
import { SFC } from 'react';

import * as styles from './go-to-top.scss';

const goToTop = () => {
  window.scrollTo(0, 0);
};

const GoToTop: SFC<any> = (props) => (
  <a id="go-to-top" className={`${props.className || ''} ${styles.goToTop}`} href="javascript:void(0)" onClick={goToTop}>
    <span className={`${styles.icon} ic-ic-arrow-up`}></span>
  </a>
);

export default GoToTop;
