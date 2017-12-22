import * as React from 'react';
import { SFC } from 'react';

import * as styles from './container.scss';

const Container: SFC<{ className?: string }> = (props) => (
  <div className={`${styles.container} ${props.className || ''}`}>
    { props.children }
  </div>
);

export default Container;