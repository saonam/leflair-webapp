import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { Image, Link, LazyImage } from '../../common';
import { EndTime } from '../../sale/end-time';

import * as styles from './sale-card.scss';

import { SaleProps } from '../../api/home';

type SaleCardProps = {
  data: SaleProps,
  className?: string,
  t?: Function
};

const SaleCard: SFC<SaleCardProps> = (props) => (
  <Link path={props.data.potd ? `/products/${props.data.slug}` : `/sales/${props.data.slug}`} className={props.className}>
    <div className={styles.currentSale}>
        {(props.data.categories && props.data.categories.indexOf('International') !== -1)  && <div className={styles.internationalTile}>{props.t('common:INTERNATIONAL')}</div>}
        <div className={styles.imageWrapper}>
          <LazyImage
            className={styles.currentSaleImg}
            filename={props.data.image}
            srcset={[640, 1080, 1440]}
            sizes={['(max-width: 575px) 100vw', '(max-width: 767px) 540px', '(max-width: 991px) 336px', '(min-width: 992px) 456px', '(min-width: 1200px) 546px', '100vw']}
            alt={props.data.title}
            lazyLoadImageType={styles.currentSalePlaceholder} />
          </div>
        <div className={styles.currentSaleInfo}>
            <div className={styles.currentSaleTitle}>{props.data.title}</div>
            <div className={styles.endTimeWrap}>
              <EndTime className={styles.endTimeContent} date={props.data.endTime} />
            </div>
        </div>
    </div>
  </Link>
);

export default translate('sales')(SaleCard);
