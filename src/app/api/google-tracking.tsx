import * as React from 'react';

import { OrderProps } from '../api/orders';

export const GoogleConversionTracking = ({ order }: { order: OrderProps }) => {
  const value = order.products.reduce((sum, p) => sum + p.quantity * p.salePrice, 0);

  return (
    <div>
      <script type="text/javascript">
        {`/* <![CDATA[ */
          var google_conversion_id = 824929307;
          var google_conversion_language = "en";
          var google_conversion_format = "3";
          var google_conversion_color = "ffffff";
          var google_conversion_label = "SA7WCOXDkXEQ2PK4lgM";
          var google_conversion_value = ${value};
          var google_conversion_currency = "VND";
          var google_remarketing_only = false;
        /* ]]> */`}
      </script>
      <script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js"></script>
      <noscript>
        <div style={{display: 'inline'}}>
          <img height="1" width="1" style={{borderStyle: 'none'}} alt="" src={`//www.googleadservices.com/pagead/conversion/824929307/?value=${value}&amp;currency_code=VND&amp;label=SA7WCOXDkXEQ2PK4lgM&amp;guid=ON&amp;script=0`}/>
        </div>
      </noscript>
    </div>
  );
};

export const GoogleRemarketingTracking = () => (
  <div>
    <script type="text/javascript">
      {`/* <![CDATA[ */
        var google_conversion_id = 824929307;
        var google_custom_params = window.google_tag_params;
        var google_remarketing_only = true;
      /* ]]> */`}
    </script>
    
    <script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js"></script>
    
    <noscript>
      <div style={{display: 'inline'}}>
        <img height="1" width="1" style={{borderStyle: 'none'}} alt="" src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/824929307/?guid=ON&amp;script=0"/>
      </div>
    </noscript>
  </div>
);
