import * as React from 'react';
import { render } from 'react-dom';
import { BREAKPOINT_MAX } from './layouts';

import * as css from './app.scss';
import './leflair-font-icon.scss';

/**
 * This class acts as a mount point for react-hot-loader
 * which requires a stateful React component at the base of
 * the application. We're also using it to load any global
 * styles for the app from the app.scss stylesheet.
 */
class App extends React.Component<{ children: any }, {}> {
  render() {
    return (
      <main className={css.body}>
        {this.props.children}
      </main>
    );
  }
};

export default App;

// add this here to make sure it will add the eventListener once
if (typeof window !== 'undefined') {
  let lastY = 0;
  let lastScrollTop = 0;
  const delta = 10;
  const navbarHeight = 101;

  const appRoot = document.getElementById('root');
  
  window.onscroll = () => {
    const goToTop = document.getElementById('go-to-top');
    const cateMobileRoot = document.getElementById('cate-mobile-root');
    const st = window.scrollY;

    if (goToTop) {
      if (window.scrollY >= appRoot.offsetHeight - 2 * window.innerHeight || (window.scrollY > window.innerHeight && lastY > window.scrollY)) {
        goToTop.classList.add('totop-show');
      } else {
        goToTop.classList.remove('totop-show');
      }
      lastY = window.scrollY;
    }

    // for category show/hide on mobile
    if (window.innerWidth <= BREAKPOINT_MAX.md) {
      if (cateMobileRoot) {
        if(Math.abs(lastScrollTop - st) <= delta)
          return;
        if (lastScrollTop < st && navbarHeight < st) {
          cateMobileRoot.classList.add('cate-hide');
          cateMobileRoot.classList.remove('cate-show');
        } else {
          cateMobileRoot.classList.remove('cate-hide');
          cateMobileRoot.classList.add('cate-show');
        }
        lastScrollTop = st;
      }
    }
  }
}

export const envLookup: { [key: string]: string } = {
  'www.leflair.vn': 'production',
  'www.staging.leflair.io': 'staging'
};
