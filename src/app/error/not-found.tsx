import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { StaticPage, Link, Button } from '../common';

import * as styles from './not-found.scss';

export const notFoundAction = async (params?: any) => ({
  component: <NotFound />
});

const NotFoundComponent: SFC<{}> = (props: any) => (
  <StaticPage>
    <div className={styles.pageSection} >
      <div className={styles.heroImage}>
        <img src="/images/heroError.jpg"/>
      </div>

      <div className={styles.caption}>
        <h1 className={styles.title}>{props.t(props.title || 'common:404_TITLE')}</h1>
        <h3 className={styles.subtitle}>{props.t(props.subtitle || 'common:404_SUBTITLE')}</h3>
        <p className={styles.desc}>{props.t(props.desc || 'common:404_DESC')}</p>
        <Link path={'/'}>
          <Button className={[styles.btn, styles.btnPrimary, styles.btnHome].join('  ')}>{props.t(props.CTA || 'common:ERROR_CTA')}</Button>
        </Link>
      </div>
    </div>
  </StaticPage>
);

const NotFound = translate('page')(NotFoundComponent) as any;

export default NotFound;
