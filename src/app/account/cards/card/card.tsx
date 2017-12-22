import * as React from 'react';
import { SFC } from 'react';

import * as styles from './card.scss';

import { CreditCardProps } from '../../../api/credit-cards';

const Card: SFC<{card: CreditCardProps, className?: string}> = (props) => (
  <div className={props.className}>
    <div className={styles.card}>
      <div className={styles.cardBlock}>
        <div className={styles.heading}>
          {props.card.type.toUpperCase()} ending {props.card.lastDigits}
        </div>

        <div className={styles.cardHolder}>{props.card.cardholderName}</div>
      </div>
    </div>
  </div>
);

export default Card;
