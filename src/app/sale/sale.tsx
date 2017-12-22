import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import * as qs from 'qs';

import { DefaultLayout, BREAKPOINT_MAX } from '../layouts';
import { Container, Row, Grid, Breadcrumb, Button } from '../common';
import { SubscriptionForm } from '../common/subscription-form';
import { history } from '../router';

import { ProductCard } from '../product';
import { TotalItems } from './total-items';
import { EndTime } from './end-time';
import { Sort } from './sort';
import { Filter } from './filter';

import * as styles from './sale.scss';

import { SaleProps, ProductProps, FilterProps, FilterOptionProps, getSale } from '../api/sales';
import * as Criteo from '../api/criteo';
import { transformFilter, jsonToQs, qsToJson, isObjectEmpty } from './sale.utils';
import { isSignedIn, isSubscribed } from '../redux/user.redux';

export const PERCENTAGE_TO_NOTIFY = 0.5;
export const QUANTITY_TO_NOTIFY = 1;

export const saleAction = async (params?: any, cookie?: any, store?: any) => {
  const saleId: string = /([\w]+)$/.exec(params.saleId)[1];
  const { sort, gender, category, color, size, brand }: any = typeof window === 'undefined' ? {} : qsToJson(location.search);
  try {
    const sale: SaleProps = await getSale(saleId, {
      gender, category, color, size, brand
    }, sort, store);
    // const saleWithMailBox = sale.products.splice(1, 0, SubscriptionBox);

    // check if POTD sale (if there's only one product)
    if (sale.potd) {
      const productQueryParams = qs.parse(sale.products[0].queryParams ? sale.products[0].queryParams.replace('?', '') : '');
      const urlQueryParams = qs.parse(typeof window !== 'undefined' && location.search ? location.search.replace('?', '') : '');
      const queryString = qs.stringify({
        ...productQueryParams,
        ...urlQueryParams
      });

      history.replace(`/products/${sale.products[0].slug}${queryString ? `?${queryString}` : ''}`);

      return;
    }

    // integrations
    Criteo.viewSale(sale.products);

    const ConnectedSale = connect(
      (state) => ({
        isSignedIn: isSignedIn(state),
        isSubscribed: isSubscribed(state),
        sale
      })
    )(SaleComponent as any);
    const Sale = translate(['common'])(ConnectedSale) as any;

    return {
      component: <Sale store={store} />,
      meta: {
        title: sale.title,
        image: `w1080/q90/${sale.image}`
      }
    };
  } catch (error) {
    // handle redirect to homepage if the sale is ended
    history.push('/');

    return;
  }
};

const Product = ({ data }: any) => (
  <ProductCard product={data} isSaleProduct={true}/>
);

const SubscriptionBox = (props: any) => (
  <div className={styles.subBoxContainer}>
    <SubscriptionForm
      title={props.t('subscription:SOLD_OUT_PRODUCTS_TITLE')}
      subTitle={props.t('subscription:SOLD_OUT_PRODUCTS_SUBTEXT')}
      thankYouSub={props.t('subscription:THANK_YOU_SUB')}
    />
  </div>
);

const scrollOffset = 115;
const scrollPadding = 115;
const footerHeight = 380;
let scrollTimer;

class SaleComponent extends Component<any, any> {
  filterContentDiv: any;
  productsList: any;
  totalProduct = 0;
  numberOfLowQuantity = 0;

  constructor(props: { sale: SaleProps, isSignedIn: boolean, isSubscribed: boolean, store: any }) {
    super(props);

    const { sort, gender, category, color, size, brand }: any = typeof window === 'undefined' ? {} : qsToJson(location.search);
    const filter = { gender, category, color, size, brand };

    this.state = {
      sale: props.sale,
      filter: transformFilter(props.sale.filter),
      selectedFilter: filter,
      isFiltersCollapsed: filter ? !(!isObjectEmpty(filter) && typeof window !== 'undefined' && window.innerWidth >= BREAKPOINT_MAX['sm']) : true,
      selectedSort: sort || props.sale.sort[0],
      soldOutPosition: this.getIndexFirstSoldOut(props.sale.products),
      isScrollOver: false,
      divScroll: 0,
      isScrollEnd: false
    }

    props.sale.products.forEach((product: ProductProps) => {
      this.totalProduct += 1;
      if (product.quantity / product.numberOfVariations <= QUANTITY_TO_NOTIFY) {
        this.numberOfLowQuantity += 1;
      }
    })

    this.toggleFilters = this.toggleFilters.bind(this);
    this.selectFilterProxy = this.selectFilterProxy.bind(this);
    this.selectFilter = this.selectFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.selectSort = this.selectSort.bind(this);
    this.getIndexFirstSoldOut = this.getIndexFirstSoldOut.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  toggleFilters() {
    this.setState({
      isFiltersCollapsed: !this.state.isFiltersCollapsed
    });

    // Wait for setState to finish and component is fully loaded
    setTimeout(() => {
      if (!this.state.isFiltersCollapsed && this.filterContentDiv && this.productsList && this.filterContentDiv.clientHeight < this.productsList.clientHeight) {
        window.addEventListener('scroll', this.handleScroll);
      } else {
        window.removeEventListener('scroll', this.handleScroll);
      }
    }, 300);
    
  }

  selectFilterProxy({ name, option }: any) {
    this.selectFilter(name, option.variations || option);
  }

  async selectFilter(key: string, option: FilterOptionProps | Array<FilterOptionProps>) {
    this.state.selectedFilter[key] = this.state.selectedFilter[key] || [];
    const options = Array.isArray(option) ? option : [option];
    const values: Array<string> = options.map((option: FilterOptionProps) => {
      return key === 'color' ? option.display : option.value;
    });

    values.forEach((value: string) => {
      const index: number = this.state.selectedFilter[key].indexOf(value);
      if (index === -1) {
        this.state.selectedFilter[key].push(value);
      } else {
        this.state.selectedFilter[key].splice(index, 1);
      }
    });

    const sale = await getSale(this.state.sale.id, this.state.selectedFilter, this.state.selectedSort, this.props.store);
    this.setState({
      sale: sale,
      filter: transformFilter(sale.filter),
      selectedFilter: this.state.selectedFilter
    });

    history.replace({
      pathname: location.pathname,
      search: jsonToQs(Object.assign({}, this.state.selectedFilter || {}, {
        sort: this.state.selectedSort
      }))
    });
  }

  async clearFilter() {
    const sale = await getSale(this.state.sale.id, {}, this.state.selectedSort, this.props.store);
    this.setState({
      sale: sale,
      filter: transformFilter(sale.filter),
      selectedFilter: {}
    });

    history.replace({
      pathname: location.pathname,
      search: jsonToQs({
        sort: this.state.selectedSort
      })
    });

      this.toggleFilters();
  }

  async selectSort(option: string) {
    const sale = await getSale(this.state.sale.id, this.state.selectedFilter, option, this.props.store);
    this.setState({
      sale: sale,
      filter: transformFilter(sale.filter),
      selectedSort: option
    });

    history.replace({
      pathname: location.pathname,
      search: jsonToQs(Object.assign({}, this.state.selectedFilter || {}, {
        sort: option
      }))
    });
  }

  getIndexFirstSoldOut(products: any) {
    var pos = 0;
    for (var index = 0; index < this.props.sale.products.length; index++) {
      if (this.props.sale.products[index].soldOut) {
        pos = index;
        break;
      }
    }
    return pos;
  }

  renderProductCard(product: ProductProps, index: number) {
    let numberOfLowQuantity = 0;
    
    return (
      <div key={index} className={`${styles.col6} ${this.state.isFiltersCollapsed ? styles.colMd4 : styles.colMd6} ${styles.colLg4}`}>
        <Product data={product}/>
        {(product.quantity > 0 && product.quantity / product.numberOfVariations  <= QUANTITY_TO_NOTIFY && this.numberOfLowQuantity / this.totalProduct < PERCENTAGE_TO_NOTIFY ) && <div className={styles.fewItemsOverlay}><span>{this.props.t('common:FEW_LEFT')}</span></div>}
      </div>
    );
  }

  subscriptionBox(props: any) {
    return (
      <div className={`${styles.col6} ${this.state.isFiltersCollapsed ? styles.colMd4 : styles.colMd5} ${styles.colLg4} ${styles.subBoxMobile}`}>
        <div className={styles.subBoxContainer} id="sale-sub-box-container">
          <SubscriptionForm
            title={props.t('subscription:SOLD_OUT_PRODUCTS_TITLE')}
            subTitle={props.t('subscription:SOLD_OUT_PRODUCTS_SUBTEXT')}
            thankYouSub={props.t('subscription:THANK_YOU_SUB')}
          />
        </div>
      </div>
    );
  }

  transformProductsToTemplates(products: any) {
    const list = products.map((product: any, index: number) => this.renderProductCard(product, index));
    if (!this.props.isSubscribed && !this.props.isSignedIn && this.state.soldOutPosition) {
      list.splice(this.state.soldOutPosition + 1, 0, this.subscriptionBox(this.props));
    }
    return list;
  }

  handleScroll(e: any) {
    const filterContentHeight = this.filterContentDiv ? this.filterContentDiv.clientHeight : 0;
    const pageYOffset = window.pageYOffset;
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    const scrollHeight = window.document.body.scrollHeight;

    if (pageYOffset >= scrollOffset && innerWidth > BREAKPOINT_MAX['sm']) { // Current page position passes the point to begin scroll filters div
      if (pageYOffset > window.document.body.scrollHeight - innerHeight - footerHeight) {
        this.setState({
          isScrollOver: filterContentHeight < innerHeight - footerHeight - scrollPadding,
          isScrollEnd: filterContentHeight >= innerHeight - footerHeight - scrollPadding
        });
      } else {
        this.setState({ 
          isScrollOver: true,
          isScrollEnd: false
        });
      }
      if (filterContentHeight + scrollPadding >= innerHeight) {
        if (filterContentHeight + scrollPadding - innerHeight - (pageYOffset - scrollOffset) > 0) { // Make filters div eventually scroll to the end if there is hidden part of it still not shown
          this.setState({
            divScroll: scrollOffset - pageYOffset
          })
        } else { // If filters div reaches its end, make it no scroll
          this.setState({
            divScroll: - (filterContentHeight + scrollPadding - innerHeight)
          })
        }
      }
    } else {
      this.setState({
        isScrollOver: false,
        divScroll: 0
      });
    }
  }

  componentDidMount() {
    document.title = this.props.sale.title || 'Leflair Vietnam - Đại tiệc hàng hiệu';

    if (!this.state.isFiltersCollapsed && this.filterContentDiv && this.productsList && this.filterContentDiv.clientHeight < this.productsList .clientHeight) {
      window.addEventListener('scroll', this.handleScroll);
      this.handleScroll(null);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    let isMultipleFilterProps = false;
    for (let key in this.state.filter) {
      if (this.state.filter[key].length >= 2) {
        isMultipleFilterProps = true;
      }
    }
    return (
      <DefaultLayout className={!this.state.isFiltersCollapsed ? 'filters-expanded' : ''}>
        <Container>
          <div className={styles.sale}>
            <div className={styles.saleHeader}>
              <Row className={`clearfix ${styles.headerTop}`}>
                <div className={styles.colMd8}>
                  <Breadcrumb className={styles.breadcrumb} build={{ sale: this.state.sale }} />
                </div>
                <div className={`hidden-sm-down ${styles.colMd4} ${styles.endTime}`}>
                  <EndTime date={this.state.sale.endTime} />
                </div>
              </Row>

              <Row className={`clearfix ${styles.headerLower} ${this.state.isFiltersCollapsed ? styles.dT : ''} ${isObjectEmpty(this.state.filter) ? styles.hiddenFilter : ''}`}>
                {isMultipleFilterProps && <div className={`${styles.leftPane} ${styles.col6} ${styles.colMd4} ${styles.btnFilterWrap} ${styles.colLg3}`}>
                  <Button type="button" className={`${styles.btn} ${styles.btnSecondary} ${!this.state.isFiltersCollapsed ? styles.filterBtn : ''} ${this.state.isFiltersCollapsed ? 'active' : styles.btnBlock}`} onClick={this.toggleFilters}>
                    {this.state.isFiltersCollapsed ? (
                      <span>{this.props.t('common:SHOW_FILTERS')}<i className={`ic-ic-arrow-right ${styles.iconShow}`}></i></span>
                    ) : (
                        <span><i className={`ic-ic-arrow-left ${styles.iconHide}`}></i>{this.props.t('common:HIDE_FILTERS')}</span>
                      )}
                  </Button>
                </div>}
                <div className={`${styles.rightPane} ${styles.col6} ${isMultipleFilterProps ? `${styles.colMd8} ${styles.colLg9}`  : styles.colMd12}`}>
                  <Row>
                    <div className={`hidden-sm-down ${styles.colMd6} ${styles.leftPane}`}>
                      {!isObjectEmpty(this.state.selectedFilter) && (
                        <a href="javascript:void(0)" className={styles.btnClearFilter} onClick={this.clearFilter}>
                          {this.props.t('common:CLEAR_FILTER')} <span className={styles.seprator}> | </span>
                        </a>
                      )}
                      <TotalItems className={styles.totalItems} total={this.state.sale.products.length} />
                    </div>
                    <div className={`clearfix ${styles.colMd6} ${styles.rightPane} ${styles.btnSortWrap} ${!isMultipleFilterProps ? styles.margin12 : ''}`}>
                      <Sort data={this.state.sale.sort} currentSelected={this.state.selectedSort} onSelect={this.selectSort} />
                    </div>
                  </Row>
                </div>
                <div className={`hidden-md-up ${styles.mobileData}`}>
                  <TotalItems className={`${styles.totalItems} ${styles.col6}`} total={this.state.sale.products.length} />
                  <EndTime className={`${styles.endTime} ${styles.col6}`} date={this.state.sale.endTime} />
                </div>
              </Row>
            </div>

            <div className={styles.saleContent}>
              <Row>
                {!this.state.isFiltersCollapsed && (
                  <div className={`${styles.filtersContainer} ${styles.colMd4} ${styles.colLg3} ${this.state.isScrollOver ? styles.fixedPosition : ''}`}>
                    <div className={`hidden-md-up ${styles.filtersHeader}`}>
                      <a className={styles.btnClearall} onClick={this.clearFilter}>
                        {this.props.t('common:CLEAR_FILTER')}
                      </a>
                      <a className={styles.btnDone} onClick={this.toggleFilters}>
                        <i className="fa fa-caret-left fa-fw"></i>
                        {this.props.t('common:DONE')}
                      </a>
                      <TotalItems className={styles.totalItems} total={this.state.sale.products.length} />
                    </div>

                    <div className={`${styles.fitlersContentWrap} ${this.state.isScrollEnd ? styles.positionAbsolute : ''}`} style={{ transform: this.state.isScrollOver ? `translate3d(0px, ${this.state.divScroll}px, 0px)` : ''}} ref={(filterContent => this.filterContentDiv = filterContent)}>
                      {Object.keys(this.state.filter).map((filterName: string) => this.state.filter[filterName].length > 0 && (
                        <Filter key={filterName} name={filterName} options={this.state.filter[filterName]} selected={this.state.selectedFilter[filterName]} onSelect={this.selectFilterProxy} />
                      ))}
                    </div>
                  </div>
                )}
                {!!this.state.isScrollOver && (
                  <div className={`${styles.filtersContainer} ${styles.colMd4} ${styles.colLg3} ${styles.dumbContainer}`}></div>
                )}

                <div className={`${styles.productsList} ${this.state.isFiltersCollapsed ? styles.col12 : `${styles.colMd8} ${styles.colLg9}`}`} ref={(productsList => this.productsList = productsList)}>
                  <Row>
                    {this.transformProductsToTemplates(this.props.sale.products).map((template: any) => (template))}
                  </Row>
                </div>
                
              </Row>
            </div>
          </div>
        </Container>
      </DefaultLayout>
    )
  }
};

const Subscription = translate(['subscription'])(SubscriptionBox);
