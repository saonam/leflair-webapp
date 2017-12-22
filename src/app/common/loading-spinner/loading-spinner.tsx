import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import * as styles from './loading-spinner.scss';

const LoadingSpinner: SFC<{outerCircle?: boolean, className?: string}> = (props) => (
    <div className={props.className || ( props.outerCircle ? styles.spinnerContainer: '')}>
        <div className={props.outerCircle ? styles.spinner : styles.spinnerInner}>
            <div className={styles.bounce1}></div>
            <div className={styles.bounce2}></div>
            <div className="bounce3"></div>
        </div>
    </div>
);

export default LoadingSpinner;
