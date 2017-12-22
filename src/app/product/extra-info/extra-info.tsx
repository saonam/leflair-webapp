import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { Row } from '../../common';

import * as styles from './extra-info.scss';

const ExtraInfo: SFC<{ returnable: boolean, isOverseas?: boolean, id?: string, className?: string, t?: Function}> = (props) => (
  <Row id={props.id || ''} className={`${props.className || ''} ${styles.extraInfoSection}`}>
    <div className={`${styles.extraInfo} ${styles.colMd6} ${styles.colSm12}`}>
        <div className={styles.infoImage}>
            <img src="/images/product-extra-guarantee.jpg" alt="Product extra guarantee" />
        </div>
        <div className={styles.infoText}>
            <div className={styles.title}>{props.t('products:DESC_SECTION_GG_TITLE')}</div>
            <ul className={styles.textListUl}>
                <li className={styles.textList}>{props.t('products:DESC_SECTION_GG_TEXT_1')}</li>
                <li className={styles.textList}>{props.t('products:DESC_SECTION_GG_TEXT_2')}</li>
                <li className={styles.textList}>{props.t('products:DESC_SECTION_GG_TEXT_3')}</li>
            </ul>
        </div>
    </div>

    {props.returnable && (
      <div className={`${styles.extraInfo} ${styles.colMd6} ${styles.colSm12}`}>
          <div className={styles.infoImage}>
              <img src="/images/product-extra-return.jpg" alt="Product extra guarantee" />
          </div>
          <div className={styles.infoText}>
              <div className={styles.title}>{props.t('products:DESC_SECTION_RETURN_TITLE')}</div>
              <ul className={styles.tableGroup}>
                  <li>
                      <div className={styles.orderNumber}>1</div>
                      <div className={styles.itemText}>{props.t('products:DESC_SECTION_RETURN_TEXT_1')}</div>
                  </li>
                  <li>
                      <div className={styles.orderNumber}>2</div>
                      <div className={styles.itemText}>{props.t('products:DESC_SECTION_RETURN_TEXT_2')}</div>
                  </li>
                  <li>
                      <div className={styles.orderNumber}>3</div>
                      <div className={styles.itemText}>{props.t('products:DESC_SECTION_RETURN_TEXT_3')}</div>
                  </li>
                  <li>
                      <div className={styles.orderNumber}>4</div>
                      <div className={styles.itemText}>{props.t('products:DESC_SECTION_RETURN_TEXT_4')}</div>
                  </li>
              </ul>

          </div>
      </div>
    )}
    {props.isOverseas && <div className={`${styles.extraInfo} ${styles.colMd6} ${styles.colSm12}`}>
        <div className={styles.infoImage}>
            <img src="/images/product-leflair-international.jpg" alt="Product international" />
        </div>
        <div className={styles.infoText}>
                <div className={styles.title}>{props.t('products:INTERNATIONAL_POLICY_LEFLAIR')}</div>
            <ul className={styles.textListUl}>
                <li className={styles.textList}>{props.t('products:INTERNATIONAL_POLICY_EXCLUSIVE')}</li>
                <li className={styles.textList}>{props.t('products:INTERNATIONAL_POLICY_SHIPPING')}</li>
                <li className={styles.textList}>{props.t('products:INTERNATIONAL_POLICY_SOURCE_SERVICE')}</li>
                <li className={styles.textList}>{props.t('products:INTERNATIONAL_POLICY_NO_RETURN')}</li>
            </ul>
        </div>
    </div>}
  </Row>
);

export default translate('products')(ExtraInfo);
