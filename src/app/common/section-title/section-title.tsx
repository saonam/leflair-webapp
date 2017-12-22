import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import * as styles from './section-title.scss';

const SectionTitle: SFC<{ title: string, subTitle?: string, className?: string, t?: Function}> = (props) => (
    <div className={`${styles.titleWrap} ${props.className}`}>
        <h2 className={styles.title}>{props.title}</h2>
        { props.subTitle && <div className={styles.subTitle}>{props.subTitle}</div>}
    </div>
)

export default translate('common')(SectionTitle);
