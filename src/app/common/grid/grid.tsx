import * as React from 'react';
import { SFC } from 'react';

import { Container, Row } from '../';

import * as styles from './grid.scss';

type ColumnDef = {
    xs?: number,
    sm?: number,
    md: number,
    lg?: number,
    xl?: number,
    [key: string]: number
};

const columnStyles = (columns: number | ColumnDef) => {
    if (typeof columns !== 'object') {
        return [`col${12 / columns}`];
    }

    const styles = Object.keys(columns)
        .map(breakpoint => `col${breakpoint.replace(/(^.)/, (ss) => ss.toUpperCase())}${12/columns[breakpoint]}`)
        .map(className => className.replace('colXs', 'col'));

    return styles;
};

const Grid: SFC<{ component: React.ComponentType<any>, columns: number | ColumnDef, data: Array<any>, breakPoint?: string, className?: string }> = (props) => {
    const { component, columns, data } = props;
    const Component = component;
    const columnClass = columnStyles(columns);
    const numColumns = typeof columns === 'object' ? columns.md : columns;

    return (
        <Row>
            { data.map( (item: any, index: number) => (
                <div className={`${columnClass.map(styleKey => (styles as any)[styleKey]).join(' ')} ${props.className || ''}`} key={index}>
                    <Component data={item} />
                </div>
            )) }
        </Row>
    );
};

export default Grid;
