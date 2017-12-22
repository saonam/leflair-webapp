import * as React from 'react';
import { SFC } from 'react';
import { Currency} from '../../common';

import * as styles from './product-info.scss';

const ProductInfo: SFC<{title: string, brand: string, retailPrice: number, salePrice: number, className?: string}> = (props) => (
  <div className={`${styles.productInfo} ${props.className || ''}`}>
      <h4 className={styles.brand}>{props.brand}</h4>
      <h4 className={styles.title}>{props.title}</h4>
      <div id="product-prices">
          <Currency className={styles.retailPrice} amount={props.retailPrice}/>
          <Currency className={styles.salePrice} amount={props.salePrice}/>
      </div>
  </div>
);

export default ProductInfo;
