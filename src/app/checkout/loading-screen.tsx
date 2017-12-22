import * as React from 'react';

import { CheckoutLayout } from '../layouts';
import { LoadingSpinner } from '../common';

export const LoadingScreen = () => (
    <CheckoutLayout>
        <LoadingSpinner outerCircle={true} />
    </CheckoutLayout>
);
