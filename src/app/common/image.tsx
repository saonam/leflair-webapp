import * as React from 'react';
import { SFC } from 'react';

const imageUrl = (filename: string, size: number, quality?: number, square?: boolean) => `https://images.leflair.vn/w${size}/q${quality || 85}${square ? '/sq' : ''}/${filename}`;

const Image: SFC<{ filename: string, alt: string, srcset: Array<number>, sizes?: Array<string>, primary?: number, quality?: number, square?: boolean, className?: string, id?: string, style?: any }> = (props) => {
  const { filename, alt, srcset, sizes, primary, quality, square, className, id, style } = props;

  const srcSet = srcset.map(size => `${imageUrl(filename, size, quality, square)} ${size}w`).join(', ');

  return <img id={id || ''} className={className || ''} src={imageUrl(filename, primary || srcset[0], quality, square)} srcSet={srcSet} sizes={(sizes || []).join(', ')} alt={alt} style={style || {}} />
};

export default Image;
