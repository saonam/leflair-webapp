import * as React from 'react';

import * as styles from './image-place-holder.scss';

export const ImagePlaceHolder = (props: any) => {

    return <div className={styles.placeholder} {...props}></div>;
}
