// reac-lazyload custom typings
declare module 'react-lazyload' {
    import { Component } from 'react';

    export interface LazyLoadProps {
      once?: boolean;
      height?: number | string;
      offset?: number | string;
      overflow?: boolean;
      scroll?: boolean;
      children?: JSX.Element;
      throttle?: number | boolean;
      debounce?: number | boolean;
      placeholder?: any;
      unmountIfInvisible?: boolean;
    }
    
    export default class LazyLoad extends React.Component<LazyLoadProps> {
      constructor(props: LazyLoad);
    }
    
    export  function lazyload(option: {}): LazyLoad;
    
    export function forceCheck(): void;
}

declare module "react-slick" {
    import * as React from 'react';

    export interface ReactSlickProps {
        responsive?: any;
        dots?: boolean;
        infinite?: boolean;
        speed?: number;
        slidesToShow?: number;
        slidesToScroll?: number;
        lazyLoad?: boolean;
        arrows?: boolean;
        autoplay?: boolean;
        autoplaySpeed?: number;
    }

    export default class Slider extends React.Component<ReactSlickProps> {
        constructor(props: ReactSlickProps);
    }
}
