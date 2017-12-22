import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';
import { SectionTitle } from '../../common';

import { ProductsCarousel } from '../../product';

import * as styles from './best-sellers.scss';

const BestSellers: SFC<any> = (props) => props.bestSellers && props.bestSellers.length ? (
  <div id="best-sellers" className={`${props.className}`}>
    <SectionTitle
      title={props.t('home:TODAY_BEST_SELLERS')}
      className={styles.titleContainer}
  />

    <ProductsCarousel products={props.bestSellers} isHomeSale={props.isHomeSale}/>
  </div>
) : <div />;

export default translate(['home'])(BestSellers);
