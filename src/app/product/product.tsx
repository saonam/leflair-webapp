import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import * as qs from 'qs';

import { DefaultLayout, BREAKPOINT_MAX } from '../layouts';
import { Container, Row, Grid, Breadcrumb, SaleTimer } from '../common';
import { history } from '../router';
import { addCartItem, getInvalidItemIds, getCartStatus, toggleCart, getCart } from '../redux/cart.redux';

import { ImagesSlider } from './images-slider';
import { ProductInfo } from './product-info';
import { ColorVariations } from './color-variations';
import { BrandInfo } from './brand-info';
import { SizeVariations } from './size-variations';
import { AddToBag } from './add-to-bag';
import { AdditionalInfo } from './additional-info';
import { ProductDescription } from './product-description';
import { ExtraInfo } from './extra-info';
import { Recommendations } from './recommendations';
import { RecentlyViewed, RecentlyViewedProductsService } from './recently-viewed';

import { ProductContentProps, ProductProps, ColorProps, SizeProps, getProductContent, viewProduct } from '../api/products';
import { addToWishlist } from '../api/wishlist';
import { getRecommendations } from '../api/recommendations';
import * as FacebookPixel from '../api/facebook-pixel';
import * as Criteo from '../api/criteo';
import * as Ants from '../api/ants';
import { ViewContent, AddToCart } from '../api/rtb-house';

import * as styles from './product.scss';

const QUANTITY_TO_NOTIFY = 2;

const recentlyViewedProductsService = new RecentlyViewedProductsService();

const getProduct = (color: ColorProps, size: SizeProps, productContent: ProductContentProps) => {
  const products: ProductProps[] = productContent.products.filter((product: ProductProps) => {
    if (color && size) {
      return product.color === color.name && product.size === size.name;
    } else if (color) {
      return product.color === color.name;
    } else if (size) {
      return product.size === size.name;
    }
    
    return true;
  });

  return products.length ? products[0] : productContent.products[0];
}

const integrate = (productContent: any, product: any, color: any, size: any) => {
  const pId = productContent.id + (color ? `_${color}` : productContent.colors && productContent.colors.length ? `_${productContent.colors[0].name}` : '');

  FacebookPixel.viewContent(product.salePrice, productContent.title, pId);
  Criteo.viewContent(pId);
  Ants.viewContent(pId);
}

export const productAction = async (params?: any, cookie?: any, store?: any) => {
  try {
    const productContentId: string = /([\w]+)$/.exec(params.productId)[1];
    if (!productContentId) {
      throw 'Invalid url';
    }

    // get product content
    const productContent = await getProductContent(productContentId, store);

    // get recommendations
    let recommendations;
    try {
      recommendations = productContent.sale.potd ? [] : await getRecommendations(productContentId);
    } catch (error) {
      // still display the page even if failed to get recommendations
      console.log('Failed to get recommendations');
    }

    const { color, size }: { color: string, size: string } = typeof window === 'undefined' ? params : qs.parse(location.search.replace('?', ''));
    const selectedColor = color ? productContent.colors.find((c: ColorProps) => c.name === color) : productContent.colors.length ? productContent.colors.find((c: ColorProps) => !c.soldOut) || productContent.colors[0] : null;
    const selectedSize = productContent.sizes.find((s: SizeProps) => s.name === size);
    const product: ProductProps = getProduct(selectedColor, selectedSize, productContent);

    //  add to recently viewed products
    const addedProduct = recentlyViewedProductsService.addProduct(productContent, product);
    const recentlyViewedProducts = recentlyViewedProductsService.getProducts({ ignore: addedProduct });

    // integrations
    integrate(productContent, product, color, size);

    // update product stat
    viewProduct(productContent.id, color || size);

    // connect & translate component
    const ConnectedProductComponent = connectProductComponent(productContent, selectedColor, selectedSize, product, recommendations || [], recentlyViewedProducts || []);
    const Product = translate(['common', 'products'])(ConnectedProductComponent);

    return {
      component: <Product />,
      meta: {
        title: productContent.title,
        description: productContent.description.heading,
        image: `w660/q90/${productContent.images[product.imageKey][0]}`
      }
    };
  } catch (error) {
    // handle redirect to homepage if the sale is ended
    history.push('/');
    
    return;
  }
};

const scrollOffset = 75;

class ProductComponent extends Component<any, any> {
  constructor(props: { productContent: ProductContentProps, selectedColor: ColorProps, selectedSize: SizeProps, product: ProductProps, recommendations: any[], recentlyViewedProducts: any[], addCartItem: Function, cartActive: boolean, invalidItemIds: string[], cartItems: any[], toggleCart: Function }) {
    super(props);

    const sumQuantity = props.productContent.products.reduce((p1: any, p2: any) => p1 + p2.quantity, 0);

    this.state = {
      productContent: props.productContent,
      selectedColor: props.selectedColor,
      selectedSize: props.selectedSize,
      product: props.product,
      recommendations: props.recommendations,
      recentlyViewedProducts: props.recentlyViewedProducts,
      addedToBag: null,
      isAddedWhishList: false,
      isAddToBagInProgress: false,
      addToBagError: false,
      isScrollOver: false,
      isScrollEnd: false,
      avarageQuantity:  sumQuantity / props.productContent.products.length
    };
    
    this.selectColor = this.selectColor.bind(this);
    this.selectSize = this.selectSize.bind(this);
    this.isProductAvailable = this.isProductAvailable.bind(this);
    this.addToBag = this.addToBag.bind(this);
    this.addToWishlist = this.addToWishlist.bind(this);
  }

  updateProduct(color: string, size: string) {
    const selectedColor = this.state.productContent.colors.find((c: ColorProps) => c.name === color);
    const selectedSize = this.state.productContent.sizes.find((s: SizeProps) => s.name === size);
    const product: ProductProps = getProduct(selectedColor, selectedSize, this.state.productContent);

    this.setState({
      selectedColor,
      selectedSize,
      product
    });

    // integrations
    integrate(this.state.productContent, product, color, size);

    // update product stat
    viewProduct(this.state.productContent.id, color || size);

    // change url
    const search = qs.stringify({ color, size });
    window.history.replaceState(null, null, `${location.pathname}${search ? `?${search}` : undefined}`);
  }

  selectColor(color: string) {
    if (!this.state.selectedColor || color !== this.state.selectedColor.name) {
      this.updateProduct(color, this.state.selectedSize ? this.state.selectedSize.name : undefined);
    }
  }

  selectSize(size: string) {
    this.setState({
      addToBagError: null
    });
    
    if (!this.state.selectedSize || size !== this.state.selectedSize.name) {
      this.updateProduct(this.state.selectedColor ? this.state.selectedColor.name : undefined, size);
    }
  }

  isProductAvailable(): boolean {
    if (this.state.productContent.colors.length > 0 && this.state.selectedColor && this.state.selectedColor.name !== this.state.product.color) {
      return false;
    }

    if (this.state.productContent.sizes.length > 0) {
      // no size selected
      if (!this.state.selectedSize) {
        const products = this.state.productContent.products.filter((product: ProductProps) => !this.state.selectedColor || this.state.selectedColor.name === product.color);

        // return true if at least one product in stock
        return !!products.some((product: ProductProps) => product.inStock);
      }

      if (this.state.selectedSize.name !== this.state.product.size) {
        return false;
      }
    }

    return this.state.product.inStock;
  }

  async addToBag() {
    if (!this.state.product || (this.state.productContent.colors.length > 1 && !this.state.selectedColor) || (this.state.productContent.sizes.length > 1 && !this.state.selectedSize)) {
      this.setState({
        addToBagError: 'FORGET_TO_SELECT_SIZE'
      });
      return;
    }

    this.setState({
      selectedColor: this.state.selectedColor || (this.state.productContent.colors.length === 1 ? this.state.productContent.colors[0] : null),
      selectedSize: this.state.selectedSize || (this.state.productContent.sizes.length === 1 ? this.state.productContent.sizes[0] : null),
      isAddToBagInProgress: true,
    });

    try {
      await this.props.addCartItem(this.state.product.id, this.state.selectedColor);
      this.setState({
        addedToBag: this.state.product.id,
        isAddToBagInProgress: false,
        addToBagError: null
      });
      this.props.toggleCart(this.props.cartActive, this.props.invalidItemIds, this.props.cartItems);
    } catch(error) {
      this.setState({
        isAddToBagInProgress: false,
        addToBagError: error.message
      });
    }
  }

  async addToWishlist() {
    if (this.state.product && !this.state.isAddedWhishList) {
      this.setState({
        isAddToBagInProgress: true
      });

      try {
        await addToWishlist(this.state.product.id);

        this.setState({
          isAddedWhishList: true,
          isAddToBagInProgress: false
        });
      } catch(error) {
        this.setState({
          isAddToBagInProgress: false
        });
      }
    }
  }

  componentDidMount() {
    document.title = this.state.productContent.title || 'Leflair Vietnam - Đại tiệc hàng hiệu';
  }
  render() {
    const isOverseas = this.state.productContent.sale.categories && this.state.productContent.sale.categories.indexOf('International') !== -1;
    const totalQuantity = this.state.productContent.products.reduce((p1: any, p2: any) => p1 + p2.quantity, 0);
    const numberOfVariations = this.state.productContent.products.length;
    return (
      <DefaultLayout>
        <Container>
          <div className={styles.product}>
            <div className={`clearfix ${styles.productHeader}`}>
              <Breadcrumb build={{product: this.state.productContent}}></Breadcrumb>
            </div>
            
            <div>
              <Row>
                <div className={`${styles.colMd7} ${styles.sliderSection}`}>
                    <ImagesSlider
                      available={this.isProductAvailable()}
                      images={this.state.productContent.images[this.state.product.imageKey]}
                    />

                    <BrandInfo
                      className={`hidden-sm-down ${styles.brandInfo}`}
                      logo={this.state.productContent.brand.logo}
                      heading={this.state.productContent.description.heading}
                      description={this.state.productContent.brand.description}
                    />
                </div>

                <div className={`${styles.rightPane} ${styles.colMd5}`}>
                  <ProductInfo
                    className={styles.productInfo}
                    title={this.state.productContent.title}
                    brand={this.state.productContent.brand.name}
                    retailPrice={this.state.product.retailPrice || 0}
                    salePrice={this.state.product.salePrice || 0}
                  />

                  {this.state.productContent.colors.length > 1 && (
                    <ColorVariations
                      className={styles.colors}
                      colors={this.state.productContent.colors}
                      onSelect={this.selectColor}
                      selectedColor={this.state.selectedColor}
                      selectedSize={this.state.selectedSize}
                      images={this.state.productContent.images}
                    />
                  )}

                  {this.state.productContent.sizes.length > 0 && (
                    <SizeVariations
                      className={styles.sizes}
                      sizes={this.state.productContent.sizes}
                      onSelect={this.selectSize}
                      selectedColor={this.state.selectedColor}
                      selectedSize={this.state.selectedSize}
                      sizeChart={this.state.productContent.sizeChart}
                    />
                  )}

                  {(this.state.product && (this.state.selectedSize || !this.state.product.size) && this.state.product.inStock && this.state.product.quantity <= QUANTITY_TO_NOTIFY) && (
                    
                    <p className={styles.fewItemsNotify}>
                      {this.state.product.quantity === 1 ? this.props.t('products:LAST_ITEM') : this.props.t('products:ONLY_FEW_ITEMS_LEFT', { count: this.state.product.quantity })}
                    </p>
                  )} 
                  {(this.state.product && !this.state.selectedSize && this.state.product.size && totalQuantity > 0 && totalQuantity / numberOfVariations <= QUANTITY_TO_NOTIFY) && <p className={styles.fewItemsNotify}>
                    {this.props.t('products:ALMOST_SOLD_OLD')}
                  </p>}
                  {this.state.addToBagError && <p className={styles.addToBagError}>{this.props.t(`products:${this.state.addToBagError}`)}</p>}

                  <AddToBag
                    className={styles.addToBag}
                    available={this.isProductAvailable()}
                    onAddToBag={this.addToBag}
                    onAddToWishlist={this.addToWishlist}
                    isBusy={this.state.isAddToBagInProgress}
                    isAddedWhishList={this.state.isAddedWhishList}
                  />

                  <div className={styles.saleTimer}>
                    <p>{this.props.t('products:THIS_SALE_WILL_END_IN')}</p>
                    <SaleTimer time={this.state.productContent.sale.endTime} className={styles.flexCenter} />
                  </div>

                  <AdditionalInfo
                    className={styles.additionalInfo}
                    available={this.isProductAvailable()}
                    returnDays={this.state.productContent.returnDays}
                    returnable={this.state.productContent.returnable}
                    isOverseas={isOverseas}
                  />

                  <ProductDescription
                    className={styles.productDesc}
                    description={this.state.productContent.description}
                    sizeChart={this.state.productContent.sizeChart}
                    selectedSize={this.state.selectedSize}
                    sizes={this.state.productContent.sizes}
                    brand={this.state.productContent.brand}
                  />
                </div>
              </Row>

              <ExtraInfo 
                className={styles.extraInfo} 
                returnable={this.state.productContent.returnable} 
                isOverseas={isOverseas}
                id="product-info"
              />
            </div>

          </div>
        </Container>

        <Container className={styles.fullViewMobile}>
            {(this.state.recommendations.length > 0 || this.state.recentlyViewedProducts.length > 0) && (
              <div className={styles.lowerContent}>
                  {this.state.recommendations.length > 0 && (
                  <div className={styles.recommendationsContainer}>
                    <Recommendations products={this.state.recommendations} />
                  </div>
                )}  
                {this.state.recentlyViewedProducts.length > 0 && (
                  <div className={styles.recentlyViewedContainer}>
                    <RecentlyViewed
                    products={this.state.recentlyViewedProducts}/>
                  </div>
                )}
              </div>
            )}
        </Container>

        <ViewContent id={this.state.productContent.id + (this.state.productContent.color ? `_${this.state.productContent.color}` 
          : this.state.productContent.colors && this.state.productContent.colors.length ? `_${this.state.productContent.colors[0].name}` : '')} />
        {this.state.addedToBag && <AddToCart id={this.state.addedToBag}/>}
      </DefaultLayout>
    )
  }
};

const connectProductComponent = (productContent: ProductContentProps, selectedColor: ColorProps, selectedSize: SizeProps, product: ProductProps, recommendations: any[], recentlyViewedProducts: any[]) => connect(
  (state) => ({
    productContent,
    selectedColor,
    selectedSize,
    product,
    recommendations,
    recentlyViewedProducts,
    cartActive: getCartStatus(state),
    invalidItemIds: getInvalidItemIds(state),
    cartItems: getCart(state)
  }), {
    addCartItem,
    toggleCart
  }
)(ProductComponent as any);
