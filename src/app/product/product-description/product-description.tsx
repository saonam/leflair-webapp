import * as React from 'react';
import { SFC, Component } from 'react';
import { translate } from 'react-i18next';

import { BREAKPOINT_MAX } from '../../layouts';

import * as styles from './product-description.scss';

import { BrandProps, DescriptionProps, SizeChartItemProps, ColorProps, SizeProps, ProductContentProps } from '../../api/products';

type ProductDescriptionProps = {
  brand: BrandProps,
  description: DescriptionProps,
  sizeChart: SizeChartItemProps[],
  selectedSize: SizeProps,
  sizes: SizeProps[],
  className?: string,
  t?: Function
};

class ProductDescription extends React.Component<ProductDescriptionProps, any>{
  productInfoSectionDiv: any;
  materialCareSectionDiv: any;
  sizeFitSectionDiv: any;
  aboutBrandMobileSectionDiv: any;

  constructor(props: ProductDescriptionProps) {
    super(props);

    this.state = {
      isOpenList: { 0: true }
    };
  }

  toggle(index: number, element?: any) {
    if (window.innerWidth > BREAKPOINT_MAX['sm']) {
      this.setState({
        isOpenList: { ...this.state.isOpenList, [index]: !this.state.isOpenList[index]}
      });
    } else {
      if (this.state.isOpenList[index]) {
        this.setState({
          isOpenList: {}
        });
      } else {
        this.setState({
          isOpenList: { [index]: true }
        });

        if (element) {
          setTimeout(() => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 50), 0); // Wait for setState to finish
        }
      }


    }
  }

  checkDescriptionList() {
    if (Object.keys(this.state.isOpenList).length) {
      Object.keys(this.state.isOpenList).forEach((key: any) => {
        if (this.state.isOpenList[key]) {
          return false;
        }
      });
    }
    return true;
  }

  render() {
    return (
      <div className={this.props.className}>
        <div ref={(productInfoSection => this.productInfoSectionDiv = productInfoSection)}>
          <AccordionGroup
            isOpen={this.state.isOpenList[0]}
            toggle={() => this.toggle(0, this.productInfoSectionDiv)}
            heading={this.props.t('products:PRODUCT_INFO')}
            body={
              <div className={styles.productInfo}>
                <Description data={this.props.description.secondary} />
              </div>
            }
          />
        </div>

        {this.props.description.materialCare && (
          <div ref={(materialCareSection => this.materialCareSectionDiv = materialCareSection)}>
            <AccordionGroup
              isOpen={this.state.isOpenList[1]}
              toggle={() => this.toggle(1, this.materialCareSectionDiv)}
              heading={this.props.t('products:MATERIAL_CARE')}
              body={
                <div className={styles.materialCare}>
                  <Description data={this.props.description.materialCare} />
                </div>
              }
            />
          </div>
        )}

        {(this.props.description.sizeFit || this.props.sizeChart) && (
          <div ref={(sizeFitSection => this.sizeFitSectionDiv = sizeFitSection)}>
            <AccordionGroup
              isOpen={this.state.isOpenList[2]}
              toggle={() => this.toggle(2, this.sizeFitSectionDiv)}
              id="size-table"
              heading={this.props.t('products:SIZE_FIT')}
              body={
                <div>
                  {this.props.description.sizeFit && (
                    <div className={styles.sizeFit}>
                      <Description data={this.props.description.sizeFit} />
                    </div>
                  )}

                  {this.props.sizeChart && (
                    <div className={styles.sizeTable}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            {this.props.sizeChart.map((col: SizeChartItemProps, index: number) => (
                              <th key={index}>{col.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {this.props.sizeChart[0].values.map((value: string, i: number) => this.props.sizes.find((size: SizeProps) => size.name === value) && <tr key={i} className={!!this.props.selectedSize && this.props.selectedSize.name === this.props.sizeChart[0].values[i] ? styles.tableInfo : ''}>
                            {this.props.sizeChart.map((col: SizeChartItemProps, j: number) => (
                              <td key={j}>
                                {this.props.sizeChart[j].values[i]}
                              </td>
                            ))}
                          </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              }
            />
          </div>
        )}

        <div ref={(aboutBrandMobileSection => this.aboutBrandMobileSectionDiv = aboutBrandMobileSection)}>
          <AccordionGroup
            className="hidden-md-up"
            isOpen={this.state.isOpenList[3]}
            toggle={() => this.toggle(3, this.aboutBrandMobileSectionDiv)}
            heading={
              <span>
                <img className={styles.aboutTheBrandLogo} src={this.props.brand.logo} />
                <span className={styles.aboutTheBrandHeading}>{this.props.t('products:ABOUT_THE_BRAND')}</span>
              </span>
            }
            body={
              <div className={styles.aboutTheBrand}>
                <h4 className={styles.heading}>
                  "{this.props.description.heading}"
              </h4>
                <div className={styles.desc}>
                  {this.props.brand.description}
                </div>
              </div>
            }
          />
        </div>
      </div>
    );
  }
}; 

const Description: SFC<{ data: any }> = (props) => (
  <ul className={styles.descList}>
    {props.data.map((desc: any, index1: number) => (
      <li key={index1}>
        {desc.header && (
          <div>
            {desc.header}
            <ul>
              {desc.data.map((item: any, index2: number) => (
                <li key={index2}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {!desc.header && (
          <div>
            {desc.data}
          </div>
        )}
      </li>
    ))}
  </ul>
);

const AccordionGroup: SFC<{ heading: any, toggle: Function, body: any, isOpen?: boolean, className?: string, id?: string }> = (props) => (
  <div id={props.id || ''} className={`${styles.group} ${props.className || ''} ${props.isOpen ? `open ${styles.panelOpen}` : ''}`}>
    <h4 className={styles.panelTitle}>
      <a id={props.id ? `${props.id}-click` : ''} className={styles.accordionToggle} href="javascript:void(0)" onClick={() => props.toggle()}>
        <div className={styles.title}>
            {props.heading}

            <span className={styles.btnCollapse}>
                <i className={`ic-ic-minus ${styles.expanded}`}></i>
                <i className={`ic-ic-plus ${styles.collapsed}`}></i>
            </span>
        </div>
      </a>
    </h4>

    <div className={`collapse ${styles.panelCollapse}`}>
      {props.body}
    </div>
  </div>
);

export default translate('products')(ProductDescription);
