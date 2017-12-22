import * as React from 'react';
import { translate } from 'react-i18next';
import { history } from '../../router';

import { DefaultLayout } from '../../layouts';
import { Container, Grid, Row, Image, Link, Button } from '../../common';
import { SaleCard } from '../../home';

import { getSecretSales } from '../../api/campaign';
import { SaleProps } from '../../api/home';
import { NotFound } from '../../error';

import * as styles from './secret-sales-page.scss';

export const secretSalesPageAction = async (params?: any, cookie?: any, store?: any) => {
    const secretSales: Array<SaleProps> = await getSecretSales(store);

    if (!secretSales) {
        return { component: <NotFound title='common:SECRET_SALES_NOTFOUND_TITLE' subtitle='common:SECRET_SALES_NOTFOUND_SUBTITLE' desc='common:SECRET_SALES_NOTFOUND_DESC' /> };
    }

    return secretSales.length > 1 ? 
        { component: <SecretSale sales={secretSales} /> } : 
        secretSales[0].potd ? 
        history.push(`/products/${secretSales[0].slug}`) : 
        history.push(`/sales/${secretSales[0].slug}`);
}

type SecretSaleProps = {
    sales: SaleProps[],
    t?: Function
};

const SecretSaleComponent: React.SFC<SecretSaleProps> = (props) => (
    <DefaultLayout className={styles.paddingTop}>
        <Container className={`${styles.container} ${styles.paddingTopContainer}`}>
            <Row>
                {props.sales.length ? props.sales.map((sale: SaleProps, index: number) => 
                    <SaleCard
                        key={index}
                        className={`${styles.colMd6} ${styles.paddingRemove}`}
                        data={sale}
                    />
                ) : <div className={styles.notFound}>{props.t('common:SECRET_SALES_NOT_FOUND')}</div>}
            </Row>
        </Container>
    </DefaultLayout>
);

const SecretSale = translate('common')(SecretSaleComponent);

export default SecretSale;
