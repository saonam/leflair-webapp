import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import * as styles from './delivery-note.scss';

const MAX_LENGTH = 60;

type DeliveryNoteProps = {
  note: string,
  onChange: Function,
  className?: string,
  t?: Function
};

const DeliveryNote: SFC<DeliveryNoteProps> = (props) => (
  <div className={props.className || ''}>
    <h4 className={styles.title}>
        {props.t('DELIVERY_NOTE')}
    </h4>
    <textarea
      rows={2}
      className={styles.formControl}
      name="note"
      placeholder="..."
      maxLength={MAX_LENGTH}
      value={props.note}
      onChange={e => props.onChange(e.target.value)} />
  </div>
);

export default translate('common')(DeliveryNote);
