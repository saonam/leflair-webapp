import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { Currency, Row, Button } from '../../common';
import { history } from '../../router';
import { getCart, updateCartItemQty, removeCartItem, getCartStatus, getInvalidItemIds, toggleCart, getCartItemHasMessage } from '../../redux/cart.redux';
import { isSignedIn } from '../../redux/user.redux';
import Slider from 'react-slick';
import { readyForCheckout } from '../../redux/user.redux';

import * as styles from './cart.scss';

import { CartItemProps } from '../../api/cart';

const shoppingPages: RegExp[] = [
  /^\/$/,             // homepage
  /^\/[\w]+$/,        // category page
  /^\/sales\//,       // sale page
  /^\/products\//,    // product page
];

type CartProps = {
  readyForCheckout: boolean,
  isSignedIn: boolean,
  cartActive: boolean,
  invalidItemIds: string[],
  cart: CartItemProps[],
  cartItemHasMessage: CartItemProps,
  updateCartItemQty: Function,
  removeCartItem: Function,
  toggleCart: Function,
  className?: string,
  t?: Function
};

const Cart: SFC<CartProps> = (props: CartProps) => {
  const calculateTotal = (cartItems: CartItemProps[]) => {
    let subtotal = 0;
    let totalSaving = 0;
    cartItems.forEach((cartItem: CartItemProps) => {  
      const quantity = cartItem.availableQuantity >= cartItem.quantity ? cartItem.quantity : cartItem.availableQuantity;
      subtotal += (!cartItem.saleEnded ? cartItem.salePrice * quantity : 0);
      totalSaving += (!cartItem.saleEnded ? (cartItem.retailPrice - cartItem.salePrice) * quantity : 0);
    });

    return {
      subtotal,
      totalSaving
    };
  };
  const genAvailableQtyArray = (num: number) => {
    const arr = [];
    for (let i = 1; i <= num; i++) {
      arr.push(i);
    }

    return arr;
  };
  const { subtotal, totalSaving } = calculateTotal(props.cart);
  const startShopping = () => {
    if (!shoppingPages.some((page: RegExp) => page.test(location.pathname))) {
      history.push('/');
    }

    props.toggleCart(props.cartActive, props.invalidItemIds, null, props.cartItemHasMessage);
  };

  const handleOnclick = () => {
    props.toggleCart(props.cartActive, props.invalidItemIds, null, props.cartItemHasMessage);
  };

  const proceedCheckout = () => {
    handleOnclick();

    if (props.readyForCheckout) {
      history.push('/cart/checkout');
    } else {
      history.push('/checkout/continue');
    }
  };

  return (
    <div className={`${props.className || ''} ${styles.cart} ${props.cartActive ? styles.active : ''}`}>
      <div className={`clearfix ${styles.heading}`}>
          <div className={styles.btnClose} title={props.t('cart:CONTINUE_TO_SHOPPING')} onClick={handleOnclick}>
              <span className={`ic-ic-close ${styles.icon}`}></span>
          </div>
          <h4 className={styles.title}>
              {props.t('cart:SHOPPING_BAG')}
              <span>({props.cart.length} {props.t('common:ITEMS')})</span>
          </h4>
      </div>
      <TranslatedPromotion total={subtotal}></TranslatedPromotion>

      <div className={`${styles.body} ${props.cart.length === 0 ? styles.empty : ''}`}>
          {props.cart.length === 0 && (
            <div className={styles.cartEmpty}>
              {/* <div className={`ic-ic-bag-empty ${styles.icon}`}></div> */}
              <div className={styles.icon}>
                <img src="/images/empty-bag.jpg" />
              </div>
              <div>{props.t('cart:YOUR_SHOPPING_BAG_IS_EMPTY')}</div>
              <div>
                <Button className={`${styles.btn} ${styles.btnPrimary} ${styles.buttonShopping}`} type="button" onClick={startShopping}>{props.t('cart:START_SHOPPING_NOW')}</Button>
              </div>
            </div>
          )}

          {props.cart.length > 0 && (
            <div>
              <div>
                {props.cart.map((cartItem: CartItemProps, index: number) => (
                  <div key={index} className={`clearfix ${styles.product}`}>
                    <a className={styles.image}
                      href="javascript:void(0)"
                      onClick={(e) => {
                        if(!cartItem.saleEnded) {
                          handleOnclick();
                          history.push(`/products/${cartItem.slug}${cartItem.queryParams || ''}`)
                        }   
                      }}>
                      {!cartItem.availableQuantity ? <div className={styles.overlay}>{props.t('sales:OUT_OF_STOCK')}</div> 
                        : cartItem.saleEnded ? <div className={styles.overlay}>{props.t('sales:SALE_ENDED')}</div> : null}
                      <img src={cartItem.image} />
                    </a>
                    <div className={styles.info}>
                      {(cartItem.categories && cartItem.categories.indexOf('International') !== -1) && <div className={styles.internationalTile}>{props.t('common:INTERNATIONAL')}</div>}
                      <div className={styles.name}>
                        <a
                          href="javascript:void(0)"
                          onClick={(e) => {
                            if(!cartItem.saleEnded) {
                              handleOnclick();
                              history.push(`/products/${cartItem.slug}${cartItem.queryParams || ''}`)
                            } 
                          }}>{cartItem.title}</a>
                      </div>
                      <Row>
                          <div className={`${styles.col6} ${styles.formGroup}`}>
                            {cartItem.size && <label className={styles.size}>{props.t('products:SIZE')}: {cartItem.size}</label>}
                            {cartItem.availableQuantity && !cartItem.saleEnded ? (
                              <div>
                                <label className={styles.quantity}>{props.t('orders:QTY')}: </label>
                                <span className={`${styles.selectStyle} ${styles.formControl}`}>
                                  <select className={`${styles.formControl} ${styles.selectQuantity}`} onChange={(e) => props.updateCartItemQty(cartItem.id, parseInt(e.target.value))} value={cartItem.quantity}>
                                      {genAvailableQtyArray(cartItem.availableQuantity).map((qty: number, index: number) => (
                                        <option key={index} value={qty}>{qty}</option>
                                      ))}
                                  </select>
                                </span>
                              </div>
                            ): (
                              <div className={`${styles.outOfStock}`}>{props.t('sales:OUT_OF_STOCK_REMOVE_NOTIFICATION')}</div>
                            )}
                            {cartItem.message && <span className={styles.errorMessage}>{props.t(`cart:${cartItem.message}`)}</span>}
                          </div>
                          <div className={`text-right ${styles.col6} ${styles.priceWrap}`}>
                              <div className={styles.price}>
                                <Currency className={styles.retailPrice} amount={cartItem.retailPrice}/>
                                <Currency className={styles.salePrice} amount={cartItem.salePrice}/>
                              </div>
                              {cartItem.availableQuantity && !cartItem.saleEnded ? <a className={styles.btnRemove} href="javascript:void(0)" onClick={(e) => props.removeCartItem(cartItem.id)}>{props.t('common:REMOVE')}</a> : null}
                          </div>
                      </Row>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                  <hr />
                  <Row className={styles.subtotal}>
                      <div className={styles.col6}>{props.t('orders:TOTAL')}:</div>
                      <div className={`text-right ${styles.col6}`}><Currency amount={subtotal} /></div>
                  </Row>
                  <Row>
                      <div className={styles.col6}>{props.t('orders:TOTAL_SAVING')}:</div>
                      <div className={`text-right ${styles.col6}`}><Currency amount={totalSaving}/></div>
                  </Row>
              </div>
              {props.cart.length > 0 && <div className={styles.btnProceedCheckoutDt}>
                  <Button
                    href="javascript:void(0)"
                    className={`${styles.btn} ${styles.btnPrimary} ${styles.btnProceedCheckout}`}
                    id="btn-proceed-checkout"
                    onClick={() => proceedCheckout()}>{props.t('cart:PROCEED_TO_CHECKOUT')}</Button>
              </div>}
            </div>
          )}
      </div>
    </div>
  );
};

const ConnectedCart = connect(
  (state: any) => ({
    isSignedIn: isSignedIn(state),
    cart: getCart(state),
    cartActive: getCartStatus(state),
    invalidItemIds: getInvalidItemIds(state),
    cartItemHasMessage: getCartItemHasMessage(state),
    readyForCheckout: readyForCheckout(state)
  }), {
    updateCartItemQty,
    removeCartItem,
    toggleCart
  }
)(Cart);

type DiscountCondition = {
  dateFrom?: number;
  dateTo?: number;
  daysOfWeek?: Array<number>;
};

type PromotionProps = {
  name: string;
  requiredTotal: number,
  discountCondition: DiscountCondition,
  messageYes: string;
  messageNo: string;
  linkDetail: string;
  code: string;
};

const Promotion: SFC<any> = (props: {total: number, t?: Function}) => {
  const checkPromotionDate = (discountCondition: DiscountCondition) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const dayOfMonth = now.getDate();

    return (discountCondition.dateFrom && discountCondition.dateTo && dayOfMonth >= discountCondition.dateFrom && dayOfMonth <= discountCondition.dateTo) 
    || (discountCondition.daysOfWeek && discountCondition.daysOfWeek.indexOf(dayOfWeek) !== -1);
  }

  const checkValidPromotion = (discountCondition: DiscountCondition, requiredTotal: number, currentValue?: number) => {
    return currentValue >= requiredTotal && checkPromotionDate(discountCondition);
  }

  const promotions: Array<PromotionProps> = [
    {
      name: 'Citi Bank',
      requiredTotal: 0,
      discountCondition: { dateFrom: 27, dateTo: 29  },
      messageYes: 'MESSAGE_CITIBANK',
      messageNo: 'MESSAGE_NO_CITIBANK',
      linkDetail: '/citi-bank',
      code: ''
    },
    {
      name: 'VP Bank',
      requiredTotal: 1500000,
      discountCondition: { daysOfWeek: [1] },
      messageYes: 'MESSAGE_VPBANK',
      messageNo: 'MESSAGE_NO_VPBANK',
      linkDetail: '/vpbank',
      code: 'VPBANK150'
    },
    {
      name: 'HSBC Mastecard',
      requiredTotal: 1000000,
      discountCondition: { daysOfWeek: [4] },
      messageYes: 'MESSAGE_HSBC',
      messageNo: 'MESSAGE_NO_HSBC',
      linkDetail: '/hsbc-mastercard',
      code: 'MASTERCARD10'
    }
  ];
  
  const settings = {
    arrows: true,
    autoplay: false,
    swipeToSlide: false,
    draggable: false,
    infinite: false
  };

  return (
    <div className={`partner-promote-section ${styles.promoteSection}`}>
      <Slider {...settings}>
        {promotions.map((promotion: PromotionProps, index: number) => checkValidPromotion(promotion.discountCondition, promotion.requiredTotal, props.total) && ( 
          <div key={index}>
            <p dangerouslySetInnerHTML={{__html: props.t(`cart:${promotion.messageYes}`, {code: promotion.code} )}} className={`${styles.content} ${promotions.length > 1 ? styles.multiItem : ''}`} />
          </div>
        ) || checkPromotionDate(promotion.discountCondition) && (
          <div key={index}>
            <p dangerouslySetInnerHTML={{__html: props.t(`cart:${promotion.messageNo}`, {linkDetail: promotion.linkDetail} )}} className={`${styles.content} ${promotions.length > 1 ? styles.multiItem : ''}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

const TranslatedPromotion = translate('cart')(Promotion);


export default translate(['common', 'cart', 'orders', 'products'])(ConnectedCart);
