import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { Button } from '../../common';

import * as styles from './add-to-bag.scss';

const AddToBag: SFC<{available: boolean, isBusy: boolean, isAddedWhishList: boolean, onAddToBag: Function, onAddToWishlist: Function, className?: string, t?: Function}> = (props) => (
  <div className={props.className || ''}>
    {props.available ? (
      <Button 
        type="button" 
        className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBlock}`} 
        onClick={() => props.onAddToBag()}
        isBusy={props.isBusy}
        >
          {props.t('products:ADD_TO_BAG')}
        </Button>
    ) : (
      <div>
        <div className={styles.text}>{props.t('products:SOLD_OUT_ITEM_TEXT')}</div>

        <div className={`${styles.alert} ${styles.alertSuccess} ${styles.addedWhishListDesc} ${props.isAddedWhishList ? styles.active : ''}`}>
          {props.t('products:ADDED_TO_WISTLIST_DESC')}
        </div>

        {!props.isAddedWhishList && <Button
          type="button"
          className={`${styles.btn} ${styles.btnSecondary} ${styles.btnBlock}`} 
          onClick={() => props.onAddToWishlist()}
          isBusy={props.isBusy}
        >
          <i className={`ic-ic-check-mark ${styles.iconAdded}`}></i>
          {props.t('products:ADD_TO_WISHLIST')}
        </Button>}
      </div>
    )}
  </div>
);

export default translate('products')(AddToBag);
