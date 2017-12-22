import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Currency, Image, Link, LazyImage } from '../../common';

import * as styles from './product-card.scss';

class ProductCard extends Component<any, any> {
  constructor(props: { product: any, className?: string, isSaleProduct?: boolean, t?: Function, isHomeSale?: boolean, isCarousel?: boolean  }) {
    super(props);

    this.state = {
      image: props.product.image,
      image2: ''
    };

    this.onMouseHover = this.onMouseHover.bind(this);
  }

  onMouseHover(blur?: boolean) {
    this.setState({
      image: !this.props.product.soldOut && !blur ? this.props.product.image2 : this.props.product.image
    });
  }

  render() {
    return (
      <Link className={`${this.props.className} ${styles.productCard}`} path={`/products/${this.props.product.slug}${this.props.product.queryParams || ''}`}>
        <div onMouseEnter={() => this.onMouseHover()} onMouseLeave={() => this.onMouseHover(true)}>
          <div className={`${styles.imageContainer} ${this.props.isSaleProduct ? styles.saleProductCard : ''} ${this.props.isHomeSale ? styles.homeSale : ''}`}>
            <LazyImage
              className={`${styles.image}`}
              filename={this.state.image}
              srcset={this.props.isCarousel ? [300] : [380, 510]}
              sizes={this.props.isCarousel ? ['140px', '(min-width: 768px) 205px'] : ['50vw', '(min-width: 768px) 33.3vw']}
              alt={this.props.product.title}
              lazyLoadImageType={this.props.isHomeSale ? styles.homeSalePlaceholder : styles.salePlaceholder} />

              {this.props.product.soldOut &&
                <div className={styles.soldOutOverlay}>
                  <div className={styles.text}>{this.props.t('products:SOLD_OUT')}</div>
                </div>
              }
          </div>

          <div className={styles.titleContainer}>
            <h4 className={styles.brand}>{this.props.product.brand.name || this.props.product.brand}</h4>
            <h4 className={styles.title}>{this.props.product.title}</h4>

            <div>
              {this.props.product.retailPrice !== this.props.product.salePrice && <Currency className={styles.retailPrice} amount={this.props.product.retailPrice} />}
              <Currency className={styles.salePrice} amount={this.props.product.salePrice} />
            </div>
          </div>
        </div>
      </Link>

    );
  }
}

export default translate('products')(ProductCard);
