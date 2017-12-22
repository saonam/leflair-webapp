export const BREAKPOINT_MAX = {
  xs: 576,
  sm: 768,
  md: 992,
  lg: 1200
};

export const toggleNavbar= (mobileOnly?: boolean) => {
  if (mobileOnly) {
    let windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (windowWidth > BREAKPOINT_MAX['sm']) {
      return;
    }
  }

  const rootElem = document.getElementsByTagName('html')[0];
  const classNames = rootElem.className.split(' ');

  const navbarExpanded: number = classNames.indexOf('navbar-expanded');

  if (navbarExpanded !== -1) {
    classNames.splice(navbarExpanded, 1);
  } else {
      // open navbar
      classNames.push('navbar-expanded');
  }

  // update class names
  rootElem.className = classNames.join(' ').trim();
};
