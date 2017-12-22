import * as React from 'react';
import { SFC } from 'react';
import { connect } from 'react-redux';

import { getPreviewOffset, updatePreviewOffset } from '../../redux/user.redux';

import * as styles from './preview.scss';

const MAX_OFFSET = 31;

const Preview: SFC<{ previewOffset: number, updatePreviewOffset: Function }> = (props) => {
  const genOffsets = () => {
    const offsets = [];
    for (let i = 0; i < MAX_OFFSET; i++) {
      offsets.push(i);
    }

    return offsets;
  };

  const onChange = (offset: number) => {
    props.updatePreviewOffset(offset);
    location.reload(true);
  };

  return (
    <div className={`${styles.preview} ${props.previewOffset > 0 ? styles.red : ''}`}>
      <select className={`${styles.formControl} ${styles.formControlSm} ${styles.offsetSelect}`} value={props.previewOffset} onChange={(e) => onChange(parseInt(e.target.value))}>
        {genOffsets().map((offset: number, index: number) =>
          <option key={index} value={offset}>{offset}</option>
        )}
      </select>
    </div>
  );
};

const ConnectedPreview = connect(
  (state) => ({
    previewOffset: getPreviewOffset(state)
  }), {
    updatePreviewOffset
  }
)(Preview);

export default ConnectedPreview;
