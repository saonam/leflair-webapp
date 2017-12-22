import * as React from 'react';
import { SFC } from 'react';

import  { isBigCampaign } from '../../../campaign';

import * as styles from './international-cp.scss';

const LogoDefault: SFC<any> = (props) => (
    <img src="/images/leflair-logo-black.png" />
);

const LogoSeasonal: SFC<any> = (props) => (
    <img src="/images/leflair-logo-birthday.png" />
);

const Logo = isBigCampaign ? LogoSeasonal : LogoDefault;
export default Logo;
