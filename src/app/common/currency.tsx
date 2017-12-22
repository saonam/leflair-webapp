import * as React from 'react';

export const formatMoney = (amount: number) => amount ? `${amount.toLocaleString('vi-VN')}₫` : '0₫';

export const Currency: React.SFC<{ amount: number, className?: string }> = (props) => (
    <span className={props.className || ''}>{ formatMoney(props.amount) }</span>
);
