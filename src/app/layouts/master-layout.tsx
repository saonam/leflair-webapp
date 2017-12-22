import * as React from 'react';
import { SFC } from 'react';

import { TrackOtherPages } from '../api/rtb-house';
import { GoogleRemarketingTracking } from '../api/google-tracking';

const ignorePages: RegExp[] = [
    /^\/$/,             // homepage
    /^\/[\w]+$/,        // category page
    /^\/products\//,    // product page
    /^\/cart\//         // checkout pages
];

const MasterLayout: SFC<{children?: any}> = (props) => (
  <div>
    {props.children}

    {typeof window !== 'undefined' && !ignorePages.some((page: RegExp) => page.test(location.pathname)) && <TrackOtherPages />}

    <GoogleRemarketingTracking />
  </div>
);

export default MasterLayout;
