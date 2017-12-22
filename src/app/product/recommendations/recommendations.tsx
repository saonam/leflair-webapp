import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { ProductsCarousel } from '../products-carousel';

import * as styles from './recommendations.scss';

import { ProductProps } from '../../api/products';

const Recommendations: SFC<{products: ProductProps[], className?: string, t?: Function}> = (props) => (
  <div>
    <div className={styles.titleContainer}>
      <h3 className={`text-xs-center ${styles.title}`}>{props.t('products:YOU_MAY_LIKE')}</h3>
      <div className={styles.separator}></div>
    </div>

    <ProductsCarousel products={props.products} />
  </div>
);

export default translate('products')(Recommendations);
