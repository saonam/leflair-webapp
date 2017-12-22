import * as React from 'react';
import { SFC } from 'react';
import LazyLoad from 'react-lazyload';

import { Image } from './';
import { ImagePlaceHolder } from './image-place-holder';

const defaultOffset = 300;

export default ({ lazyLoadImageType, offset, ...rest }: any) => <LazyLoad offset={offset || defaultOffset} placeholder={<ImagePlaceHolder className={lazyLoadImageType}/>}><Image {...rest} /></LazyLoad>;
