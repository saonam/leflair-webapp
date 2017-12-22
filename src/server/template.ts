import { Meta } from '../app/router';

const defaultTitle = 'Leflair Vietnam - Đại tiệc hàng hiệu';
const defaultDescription = 'Mua sắm sản phẩm thời trang và mỹ phẩm làm đẹp từ những thương hiệu hàng đầu thế giới. Cam kết chính hãng. Ưu đãi hàng hiệu độc quyền.';
const defaultUrl = 'https://www.leflair.vn';
const defaultImage = 'https://leflair-assets.storage.googleapis.com/img/link_cover2.jpg';

export default (body: string, { title, description = defaultDescription, image, url = defaultUrl }: Meta = {}, strings: string, preloadedState: any) => {
  title = title ? `${title} - Leflair.vn` : defaultTitle;
  image = image ? `https://images.leflair.vn/${image}` : defaultImage;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <base href="/" />
        <title>${title}</title>
        
        <!-- General META -->
        <meta charset="utf-8" />
        <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />

        <meta name="description" content="${description}" />
        <meta name="keywords" content="leflair, leflair.vn, leflair vietnam, hàng hiệu, hang hieu, private sales, private sale, thời trang, thoi trang, mỹ phẩm, my pham, thương hiệu quốc tế, thuong hieu quoc te, ưu đãi độc quyền, uu dai doc quyen " />
        <!-- End General META -->

        <!-- Facebook META -->
        <meta property="fb:app_id" content="1594476044142138" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="${title} - Leflair.vn" />
        <meta property="og:title" content="${title} - Leflair.vn" />
        <meta property="og:description" content="${description}" />
        <meta property="og:url" content="${url}" />
        <meta property="og:image" content="${image}" />
        <!-- End Facebook META -->

        <!-- Twitter META -->
        <meta name="twitter:title" content="${title} - Leflair.vn" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:url" content="${url}" />
        <meta name="twitter:image" content="${image}" />
        <!-- End Twitter META -->

        <!-- Fav Icon -->
        <link rel="shortcut icon" type="image/png" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAM1BMVEX///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADxgEwMAAAAEHRSTlMAECAwQFBgcICQoLDA0ODwVOCoyAAAAUBJREFUeAHt1NtyhCAMgOEEEWNAyPs/bbuDZhS1wM70jv8W91vwEPgt5ODrJDeAAQxgAAMYwAD+HUBLn5z5CkAX5Ghz/QAlORdtHzBtUkY9gEtyj9sBJ49xKzDJS64NwChaICLW8yTTBKx6PWEWvez5FsDowzdwM20DwMfvETTdg68DeOwfdd150UwVcMUdnzjJqaUC6HFT3s4S5dpWBYK+NLr1PmD/S7KcpCytE1SB41q5xTNodaBscwha/QhFkUz7QAm3g7Ptmoksl7zrHarufPDF9E9lrD2z/o+pF7DyIEyx2M5MM74AwOVAASTlDu+z7F4ATKKEp9nuMy2AZvYr7DMAc20o623qHOu6ZX3ZCqAmcDsANv51BC+5+A4ArnItzidecvQEaIaTaHFBOLUWR8rBLUv+s+Bpuq1w2D+zHxekRqT8k7LpAAAAAElFTkSuQmCC" />
        <!-- End Fav Icon -->

        <!-- Google Analytics -->
        <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/${process.env.NODE_ENV === 'production' ? 'analytics' : 'analytics_debug'}.js','ga');
        
        ${process.env.NODE_ENV !== 'production' ? `window.ga_debug = {trace: true};` : '' }
        ga('create', 'UA-65965559-1', 'auto');
        ${process.env.NODE_ENV !== 'production' ? `ga('set', 'sendHitTask', null);` : '' }
        </script>
        <!-- End Google Analytics -->

        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-WNNNRH');</script>
        <!-- End Google Tag Manager -->
        
        <!-- Ematic Bye-IQ -->
        <script>
        (function(i,s,o,g,r,a,m){i['EmaticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//api.ematicsolutions.com/v1/ematic.min.js','ematics');

        ematics('create', '416050dba26511e796c00242ac110002-sg4', {
          email: ${preloadedState && preloadedState.user && preloadedState.user.email ? `'${preloadedState.user.email}'` : 'null'},
          country_iso: 'vietnam',
          currency_iso: 'vnd',
          language_iso: 'vietnam'
        });
        </script>
        <!-- End Ematic Bye-IQ -->

        <!-- Styles -->
        <link rel="stylesheet" href="/styles.css" />
        <!-- End Styles -->
      </head>

      <body>
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WNNNRH"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->

        <div id="root">${body}</div>

        <!-- Scripts -->
        <script>
          var version = "${process.env.RELEASE}";
          var __i18n = ${strings};
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="//js.stripe.com/v3/"></script>
        <script src="//leflair.api.sociaplus.com/partner.js"></script>
        <script async src="/${process.env.RELEASE}-client.js"></script>
        <!-- End Scripts -->
      </body>
    </html>
  `;
};
