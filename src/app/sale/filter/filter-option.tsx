import * as React from 'react';
import { SFC } from 'react';

import { Button } from '../../common';

import * as styles from './filter-option.scss';

const FilterOption: SFC<any> = ({ data }: any) => (
  <div className={styles.filterOption}>
    <Button
      type="button"
      className={`${styles.btn} ${styles.btnSecondary} ${styles.btnBlock} ${data.filterName === 'color' && data.value ? 'style-color' : ''} ${data.isActive ? styles.active : ''}`}
      onClick={(e: any) => data.onSelect({
        name: data.filterName,
        option: data
      })}
    >
      {data.isActive && <span className={`${styles.icon} ic-ic-close`}></span>}
      {data.filterName === 'color' && data.value && <span className={styles.optionColor} style={{'background': data.value}}></span>}
      {data.display}
    </Button>
  </div>
);

export default FilterOption;
