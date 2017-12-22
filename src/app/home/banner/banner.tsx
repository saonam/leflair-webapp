import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Image } from '../../common';

import * as styles from './banner.scss';

class Banner extends Component<any, any> {
    constructor(props: { data: any }) {
        super(props);

        this.state = {
            selectedImage: props.data[0],
        };

        this.selectImage = this.selectImage.bind(this);
    }

    selectImage(image: string) {
        if (image !== this.state.selectedImage) {
            this.setState({
                selectedImage: image
            });
        }
    }

    render() {
        return this.props.data.length > 0 && (
            <div id="home-banner" className={`${styles.bannerContainer} ${this.props.className}`}>
                <div className={styles.csslider}>
                    {this.props.data.map((image: string, index: number) => (
                        <input
                            key={index}
                            type="radio"
                            id={`slides_${index}`}
                            name="slides"
                            checked={image === this.state.selectedImage}
                            onChange={() => this.selectImage(image)}
                        />
                    ))}

                    <div className={styles.arrows}>
                        {this.props.data.map((banner: string, index: number) => (
                            <label key={index} htmlFor={`slides_${index}`} />
                        ))}
                    </div>

                    <ul>
                        {this.props.data.map((image: any, index: number) => (
                            <li key={index}>
                                <a href={image.url} className={`${this.props.className} ${styles.imageContainer}`} target="blank">
                                    <Image
                                    className={styles.bannerImg}
                                    filename={image.image}
                                    srcset={[640, 1080, 1440]}
                                    sizes={['100vw', '(min-width: 992px) 960px', '1140px']}
                                    alt='' />
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.navigation}>
                        {this.props.data.map((banner: string, index: number) => (
                            index !== 0 && <label key={index} htmlFor={`slides_${index}`} />
                        ))}
                    </div>

                </div>

            </div>
        );
    }

}

export default Banner;