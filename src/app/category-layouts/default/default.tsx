import * as React from 'react';
import { SFC } from 'react';
import { translate } from 'react-i18next';

import { DefaultLayout } from '../../layouts';
import { Container, Grid, Row, Image, Link, Button } from '../../common';
import { EndTime } from '../../sale/end-time';

import { SaleCard } from '../../home';
import  { isBigCampaign } from '../../campaign';

import * as styles from './default.scss';

import { SaleProps } from '../../api/home';
import { TrackCategory } from '../../api/rtb-house';

import { FirstSaleTile } from '../../category/first-sale-tile';

type CategoryProps = {
    category: string,
    sales: SaleProps[],
    className?: string,
    t?: Function
};

const DefaultCategoryLayout: SFC<CategoryProps> = (props) => (
    <DefaultLayout className={`${styles.defaultLayout} ${isBigCampaign && styles.seasonalLayout}`}>
        <Container className={styles.container}>
            <Row>
                {props.sales.map((sale: SaleProps, index: number) => index === 0 ? (
                    <FirstSaleTile
                        key={index}
                        className={`${styles.colMd6} ${styles.paddingRemove}`}
                        data={sale}
                    />
                ) : (
                        <SaleCard
                            key={index}
                            className={`${styles.colMd6} ${styles.paddingRemove}`}
                            data={sale}
                        />
                    )
                )}
            </Row>
        </Container>

        <TrackCategory id={props.category} />
    </DefaultLayout>
);

export default translate(['category', 'sales'])(DefaultCategoryLayout);
