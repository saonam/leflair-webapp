import * as React from 'react';
import { translate } from 'react-i18next';

import { Container, Row, Image, Link, Button } from '../../common';
import { EndTime } from '../../sale/end-time';
import { SaleCard } from '../../home';

import * as styles from './first-sale-tile.scss';


const FirstSaleTileComponent = (props: any) => (
    <div className={styles.firstSaleContainer}>
        <Link className={`hidden-md-down ${styles.firstSaleDesktop}`} path={props.data.potd ? `/products/${props.data.slug}` : `/sales/${props.data.slug}`}>
            <Row>
                <div className={`${styles.colLg9} ${styles.imageContainer}`}>
                    <Image
                        filename={props.data.image} srcset={[640, 1080, 1440]}
                        sizes={['(max-width: 575px) 100vw', '(max-width: 767px) 540px', '100vw']}
                        alt={props.data.title}
                    />
                </div>
                <div className={`${styles.colLg3} ${styles.textContainer}`}>
                    <h2 className={styles.title}>{props.data.title}</h2>
                    <EndTime className={styles.timeWrap} date={props.data.endTime} />
                    <Button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSeeMore}`}>{props.t('sales:SEE_THIS_SALE')}</Button>
                </div>
            </Row>
        </Link>

        <SaleCard
            className={`hidden-lg-up cate-first-sale ${styles.colMd6} ${styles.paddingRemove} ${styles.saleCardContainer}`}
            data={props.data}
        />

    </div>
);

export default translate(['sales'])(FirstSaleTileComponent);
