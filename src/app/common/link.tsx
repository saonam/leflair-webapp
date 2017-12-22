import * as React from 'react';
import { isBrowserHistory, history } from '../router';

const Link = (props: any) => (
    <a className={props.className || ''} href={props.path} onClick={(e) => {
        if (isBrowserHistory(history)) {
            e.preventDefault();

            if (props.onClick) {
                props.onClick();
            }

            history.push(props.path);
        }
    }}>{props.children}</a>
);

export default Link;
