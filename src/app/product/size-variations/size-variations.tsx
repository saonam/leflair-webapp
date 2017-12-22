import * as React from 'react';
import { SFC } from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Button } from '../../common';

import * as styles from './size-variations.scss';

import { ColorProps, SizeProps, SizeChartItemProps } from '../../api/products';

type SizeVariationsProps = {
  sizes: SizeProps[],
  onSelect: Function,
  selectedColor: ColorProps,
  selectedSize: SizeProps,
  className?: string,
  t?: Function,
  sizeChart: SizeChartItemProps[]
};

const goToSizeTable = () => {
  const elem = document.getElementById('size-table');
  const classNames = elem.className.split(' ');
  if (classNames.indexOf('open') === -1) {
    document.getElementById('size-table-click').click();
  }
  window.scrollTo(0, elem.getBoundingClientRect().top + window.scrollY - 46);
};

const filterSizeChart = (sizeChart: SizeChartItemProps[], sizes: SizeProps[]) => {
  if (!sizeChart || sizeChart.length < 2) {
    return [];
  }

  // gen available size names
  const sizeNames: string[] = sizes.map(({ name }: SizeProps) => name);
  // get indexes of unavailable size values that will be removed
  const removedIndexes: number[] = sizeChart[0].values.reduce((indexes: number[], name: string, index: number) => sizeNames.indexOf(name) === -1 ? indexes.concat(index) : indexes, []);

  // remove the first item in `sizeChart` first
  return sizeChart.slice(1)
  // then remove unavailable size values
  .map(({ name, values }: SizeChartItemProps) => ({
    name,
    values: values.filter((value: string, index: number) => removedIndexes.indexOf(index) === -1)
  }));
};

const SizeVariationsComponent: SFC<SizeVariationsProps> = (props) => {
  const getSizeStatus = (size: SizeProps) => {
    if (!props.selectedColor) {
      return size.soldOut ? 'totally-empty' : 'not-empty';
    }

    return props.selectedColor.availableSizes.indexOf(size.name) > -1 ? 'not-empty' : (size.soldOut ? 'totally-empty' : 'partialy-empty');
  };
  const sizeChart = filterSizeChart(props.sizeChart, props.sizes);

  return (
    <div className={props.className}>
      <div className={`${styles.headingWrap} ${styles.clearfix}`}>
        <h5 className={styles.heading}>{props.t('products:SIZE')}</h5>
        <a className={styles.sizeTableLink} href="javascript:void(0)" onClick={goToSizeTable}>{props.t('products:VIEW_SIZE')}</a>
      </div>
      {props.sizes.map((size: SizeProps, index: number) => (
        <Size
          key={index}
          size={size}
          selectedSize={props.selectedSize}
          onSelect={props.onSelect}
          getSizeStatus={getSizeStatus}
          sizeChart={sizeChart}
          valueIndex={index}
        />
      ))}
    </div>
  )
};

class Size extends Component<any, any> {
  constructor(props: { size: SizeProps, selectedSize: SizeProps, onSelect: Function, getSizeStatus: Function, sizeChart: SizeChartItemProps[] }, valueIndex: number) {
    super(props);
  }

  render() {
    return (
      <Button
        key={this.props.size.name}
        type="button"
        className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSize} ${(styles as any)[this.props.getSizeStatus(this.props.size)]} ${this.props.selectedSize && this.props.selectedSize.name === this.props.size.name ? styles.selected : ''}`}
        onClick={() => this.props.onSelect(this.props.size.name)}>

        {this.props.size.name}
        <div className={styles.lines}></div>

        <ToolTip
          sizeChart={this.props.sizeChart}
          valueIndex={this.props.valueIndex}
          size={this.props.size}
          selectedColor={this.props.selectedColor} />
      </Button>
    );
  }
};

const ToolTipComponent = (props: any) => (
  (props.size.soldOut || props.sizeChart.length > 1) && <div className={`${styles.tooltip} ${styles.tooltipTop} ${props.className || ''}`} role="tooltip">
    <div className={styles.tooltipInner}>
      {props.size.soldOut ? (
        <h4 className={`${styles.tooltipTitle} ${styles.hideSeparator}`}>{props.t('products:SOLD_OUT_TOOLTIP_TEXT')}</h4>
      ) : (
        <div>
          <h4 className={styles.tooltipTitle}>{props.t('products:SIMILAR')}</h4>
          <table className={styles.table}>
            <tbody>
              {props.sizeChart.map((item: SizeChartItemProps, index: number) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.values[props.valueIndex]}</td>
                </tr>
              ))}
                </tbody>
          </table>
        </div>
      )}

    </div>
  </div>
);

const SizeVariations = translate('products')(SizeVariationsComponent);
const ToolTip = translate('products')(ToolTipComponent);
export default SizeVariations;
