import * as React from 'react';
import { SFC } from 'react';

import { OrderProps, ProductProps } from '../api/orders';

const RTBHouse: SFC<{id: string}> = (props) => (
  <iframe src={`//asia.creativecdn.com/tags?id=${props.id}`} width="1" height="1" scrolling="no" frameBorder="0" style={{display: 'none'}} />
);

export const TrackHome: SFC<{}> = (props) => <RTBHouse id="pr_01dY0e4guJ61lwvQGDAs_home" />;

export const TrackCategory: SFC<{id: string}> = (props) => <RTBHouse id={`pr_01dY0e4guJ61lwvQGDAs_category2_${props.id}`} />;

export const ViewContent: SFC<{id: string}> = (props) => <RTBHouse id={`pr_01dY0e4guJ61lwvQGDAs_offer_${props.id}`} />;

export const AddToCart: SFC<{id: string}> = (props) => <RTBHouse id={`pr_01dY0e4guJ61lwvQGDAs_basketadd_${props.id}`} />;

export const BeginCheckout: SFC<{}> = (props) => <RTBHouse id="pr_01dY0e4guJ61lwvQGDAs_startorder" />;

export const CaptureOrder: SFC<{order: OrderProps}> = (props) => <RTBHouse id={`pr_01dY0e4guJ61lwvQGDAs_orderstatus2_${props.order.paymentSummary.total}_${props.order.code}_${props.order.products.map((p: ProductProps) => p.id).join(',')}&cd=default`} />;

export const TrackOtherPages: SFC<{}> = (props) => <RTBHouse id="pr_01dY0e4guJ61lwvQGDAs" />;
