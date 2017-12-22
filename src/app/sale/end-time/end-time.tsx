import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import * as styles from './end-time.scss';

type EndTimeProps = {
  date: string,
  t?: Function,
  className?: string
};

const EndTime: SFC<EndTimeProps> = ({ date, t, className }) => {
  const key = date.replace(/^(\d|an|a| )+/, '_').toUpperCase();
  const array = /(\d+|an|a) /.exec(date);
  const value = array ? array[1].replace(/(an|a)/, '1') : null;

  return (
    <span className={className}>
      <i className={`ic-ic-time ${styles.icon}`} /> <span className={styles.text}>{t('common:ENDING_IN')}</span> <span className={styles.timer}>{t(`common:${key}`, { value })}</span>
    </span>
  );
};

export default translate('common')(EndTime);
