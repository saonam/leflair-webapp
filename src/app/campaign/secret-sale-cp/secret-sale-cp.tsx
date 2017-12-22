import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { getSecretSaleStatus } from '../../redux/home.redux';

import { Row, Link } from '../../common';

import * as styles from './secret-sale-cp.scss';

const SecretSaleCampComp: SFC<any> = (props) => props.secretSaleStatus && (
    <Row>
        <Link path='/sales/secret-sales' className={`${styles.colMd12} ${styles.secretSalesBanner}`}>
            <div className={styles.secretSalesBannerInner}>
                <h2 className={styles.secretSaleTitle}>{props.t('home:SECRET_SALES')}</h2>
                <h4 className={styles.secretSaleDescription}>{props.t('home:SECRET_SALES_ONLY_LEFLAIR_MEMBER')}</h4>
                <h4 className={styles.secretSaleLink}>{props.t('home:SECRET_SALES_BUY')}</h4>
            </div>
        </Link>
    </Row>
);

export default connect(
  (state) => ({
    secretSaleStatus: getSecretSaleStatus(state)
  })
)(translate('home')(SecretSaleCampComp));
