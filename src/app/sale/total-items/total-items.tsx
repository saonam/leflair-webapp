import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import * as styles from './total-items.scss';

const TotalItems: SFC<any> = (props: {total: number, t: Function, className: string}) => (
  <div className={`${props.className} ${styles.text}`}>
    {`${props.total} ${props.t('common:ITEMS')}`}
  </div>
);

export default translate('common')(TotalItems);
