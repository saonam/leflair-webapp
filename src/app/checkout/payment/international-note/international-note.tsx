import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Button } from '../../../common';

import * as styles from './international-note.scss';

type InternationalNoteProps = {
  onlyInternational: number,
  numIntProducts: number,
  removeIntProducts: Function,
  className?: String,
  t?: Function
};

type InternationalNoteState = {
  showConfirmation: boolean,
  isInProgress: boolean,
  error: string
};

class InternationalNote extends Component<InternationalNoteProps, InternationalNoteState> {
  constructor(props: InternationalNoteProps) {
    super(props);

    this.state = {
      showConfirmation: false,
      isInProgress: false,
      error: null
    };
  }

  render() {
    return (
      <div className={styles.intDescWrap}>
        <div>
          {this.props.t(`orders:${this.props.onlyInternational ? 'INT_DESC' : 'MIXED_INT_DESC'}`, { qty: this.props.numIntProducts })}
        </div>
        {!this.props.onlyInternational && <div className={styles.removeIntProductsContainer}>
          <a href="javascript:void(0)" className={styles.removeIntProducts} onClick={() => this.setState({ showConfirmation: !this.state.showConfirmation })}>
            <span className={`ic-ic-close ${styles.icon}`}></span>
            <span className={styles.link}>{this.props.t('orders:INT_REMOVE_INT_PRODUCTS')}</span>
          </a>

          {this.state.showConfirmation && <div className={`${styles.popover} ${styles.popoverBottom}`}>
            <div className="arrow"></div>
            <div className={styles.popoverContent}>
              {this.props.t('common:REMOVE_INT_PRODUCTS_CONFIRMATION')}

              <div className={`${styles.buttons} clearfix`}>
                <Button className={`${styles.btn} ${styles.btnPrimary} float-left`} type="button" isBusy={this.state.isInProgress} onClick={this.props.removeIntProducts}>{this.props.t('common:YES')}</Button>
                <Button className={`${styles.btn} ${styles.btnSecondary}`} type="button" onClick={() => this.setState({ showConfirmation: false })}>{this.props.t('common:NO')}</Button>
              </div>

              {this.state.error && <div className="text-danger">{this.props.t(`common:${this.state.error}`)}</div>}
            </div>
          </div>}
        </div>}
      </div>
    );
  }
}

export default translate('orders')(InternationalNote) as any;
