import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { ProductCard } from '../product-card';

import * as styles from './products-carousel.scss';

import { ProductProps } from '../../api/products';

class ProductsCarousel extends Component<any, any> {
  cWindow: any;
  cSlide: any;

  constructor(props: {products: ProductProps[], className: string, productsCarouselID?: string}) {
    super(props);

    this.slideLeft = this.slideLeft.bind(this);
    this.slideRight = this.slideRight.bind(this);
  }
  
  slideLeft() {
    const windowWidth = this.cWindow.clientWidth + 28;
    const currentOffset = this.cWindow.scrollLeft;
    if (currentOffset > 0) {
      this.cWindow.scrollLeft -= windowWidth;
    }
  }

  slideRight() {
    const slideWidth = this.cSlide.clientWidth;
    const windowWidth = this.cWindow.clientWidth + 24;
    const currentOffset = this.cWindow.scrollLeft;
    if (currentOffset + windowWidth < slideWidth) {
      this.cWindow.scrollLeft += windowWidth;
    }
  }

  render() {
    return (
      <div id={this.props.productsCarouselID || 'products-carousel'} className={`${this.props.className} ${styles.productsCarousel}`}>
          <div className={styles.outerbox}>
              <div className={styles.innerbox}>
                  {this.props.products.map((product: ProductProps, index: number) => (
                    <div className={styles.productCardContainer} key={index}>
                        <ProductCard className={styles.productCard} product={product} isHomeSale={this.props.isHomeSale} isCarousel={true}/>
                    </div>
                  ))}
              </div>
          </div>

          <div className={`${styles.arrow} ${styles.left}`}>
              <a className={styles.arrowBtn} onClick={this.slideLeft}>
                  <i className={`ic-ic-arrow-left ${styles.icon}`}></i>
              </a>
          </div>

          <div className={`${styles.arrow} ${styles.right}`}>
              <a className={styles.arrowBtn} onClick={this.slideRight}>
                  <i className={`ic-ic-arrow-right ${styles.icon}`}></i>
              </a>
          </div>
      </div>
    )
  }

  componentDidMount() {
    let productsCarouselID = this.props.productsCarouselID;
    
    if (typeof productsCarouselID === 'undefined') {
      productsCarouselID = 'products-carousel';
    }

    this.cWindow = document.getElementById(productsCarouselID).children[0];
    this.cSlide = this.cWindow.children[0];

  }
}

export default translate('products')(ProductsCarousel);
