import * as React from 'react';
import { SFC } from 'react';

import * as styles from './brand-info.scss';

const BrandInfo: SFC<{logo: string, heading: string, description: string, className?: string}> = (props) => (
  <div className={props.className || ''}>
      <img src={props.logo} />
      <h4 className={styles.heading}>"{props.heading}"</h4>
      <div className={styles.desc}>{props.description}</div>
  </div>
);

export default BrandInfo;
