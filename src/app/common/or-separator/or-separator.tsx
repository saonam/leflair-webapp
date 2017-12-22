import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import * as styles from './or-separator.scss';

export default translate('common')((props: { t: Function }) => (
    <div className={styles.separator}>
        <hr/>
        <span className={styles.orText}>{props.t('common:OR')}</span>
    </div>
) as any);
