import * as React from 'react';
import { SFC } from 'react';

import * as styles from './row.scss';

const Row: SFC<{ className?: string, id?: string }> = (props) => (
    <div id={props.id} className={`${styles.row} ${props.className || ''}`}>
        { props.children }
    </div>
);

export default Row;
