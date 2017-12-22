import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import Link from '../link';

import * as styles from './breadcrumb.scss';

const BreadCrumb: SFC<any> = (props: {build: any, t: Function, className: string}) => {
  const items: any[] = [{
    title: props.t('sales:SALES'),
    url: '/'
  }];

  // build sale page
  if (props.build['sale']) {
    items.push({
      title: props.build['sale'].title
    });
  }
  // build product page
  else if (props.build['product']) {
    if (props.build['product'].sale && !props.build['product'].sale.potd) {
      items.push({
        title: props.build['product'].sale.title,
        url: `/sales/${props.build['product'].sale.slug}`
      });
    }
    items.push({
      title: props.build['product'].title
    });
  }

  return (
    <ol className={`${props.className} ${styles.breadcrumb}`}>
      {items.map((item: any, index: number) => (
        <li key={index} className={styles.breadcrumbItem}>
          {index < items.length - 1 ? (
            <Link path={item.url}>{item.title}</Link>
          ) : (
            <span>{item.title}</span>
          )}
        </li>
      ))}
    </ol>
  );
};

export default translate('sales')(BreadCrumb);
