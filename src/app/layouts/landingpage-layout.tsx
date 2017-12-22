import * as React from 'react';
import { SFC } from 'react';

import MasterLayout from './master-layout';
import { LandingpageHeader } from './header';
import { Footer } from './footer';
import { GoToTop } from './go-to-top';

import * as styles from './default-layout.scss';

const LandingpageLayout: SFC<{ className?: string }> = (props) => (
  <MasterLayout>
    <div className={`${styles.container} ${props.className}`} id="landingpage-layout">

        <LandingpageHeader />

        { props.children }

        <Footer />

        <GoToTop />
    </div>
  </MasterLayout>
);

export default LandingpageLayout;
