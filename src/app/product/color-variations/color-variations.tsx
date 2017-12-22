import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { Button, Image } from '../../common';

import * as styles from './color-variations.scss';

import { ColorProps, SizeProps } from '../../api/products';

const ColorVariations: SFC<{
  colors: ColorProps[],
  onSelect: Function,
  selectedColor: ColorProps,
  selectedSize: SizeProps,
  images: {[key: string]: string[]},
  className?: string,
  t?: Function
}> = (props) => {

  const getColorStatus = (color: ColorProps) => {
    if (!props.selectedSize) {
      return color.soldOut ? 'totally-empty' : 'not-empty';
    }

    return props.selectedSize.availableColors.indexOf(color.name) > -1 ? 'not-empty' : (color.soldOut ? 'totally-empty' : 'partialy-empty');
  }

  return (
    <div className={props.className || ''}>
      <h5 className={styles.heading}>{props.t('products:COLOR')}: {props.selectedColor && <span className={styles.colorSelected}>{props.selectedColor.name}</span>} </h5>

      {props.colors.map((color: ColorProps, index: number) => (
        <Button
          key={index}
          type="button"
          className={`${styles.btn} ${styles.btnSecondary} ${styles.btnColor} ${(styles as any)[getColorStatus(color)]} ${props.selectedColor && props.selectedColor.name === color.name ? styles.selected : ''}`}
          onClick={() => props.onSelect(color.name)}
        >
          &nbsp;
          <div className={styles.lines}>
            <Image filename={props.images[color.name][0]} alt="" srcset={[90]} style={{ width: '100%' }} />
            <div className={styles.soldOutOverlay}></div>
          </div>
        </Button>
      ))}
    </div>
  )
};

export default translate('products')(ColorVariations);