import * as React from 'react';
import { SFC } from 'react';

import { DefaultLayout } from '../../layouts';

import { Container } from '../container';
import Link from '../link';

import * as styles from './static-page.scss';

const StaticPage: SFC<{ className?: string }> = (props) => (
    <DefaultLayout>
        <Container>
            <div className={styles.content}>
                { props.children }
            </div>
        </Container>
    </DefaultLayout>
);

export default StaticPage;
