import * as React from 'react';

import { LoadingSpinner } from './loading-spinner';

const Button: React.SFC<any> = ({ children, isBusy, ...rest }) => 
    <button {...rest} disabled={isBusy}>
        {isBusy ? <LoadingSpinner /> : children}
    </button>

export default Button;
