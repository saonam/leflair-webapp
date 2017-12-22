import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';
import Slider from 'react-slick';

import { Row, Image } from '../../common';

import * as styles from './images-slider.scss';

class ImagesSlider extends Component<any, any> {
  constructor(props: {available: boolean, images: string[], className?: string, t?: Function}) {
    super(props);

    this.state = {
      selectedImage: props.images[0],
      zoomImageStyle: {},
      navigationDir: 'down',
    };

    this.selectImage = this.selectImage.bind(this);
    this.zoomImage = this.zoomImage.bind(this);
    this.slideUp = this.slideUp.bind(this);
    this.slideDown = this.slideDown.bind(this);
  }

  selectImage(image: string) {
    if (image !== this.state.selectedImage) {
      this.setState({
        selectedImage: image
      });
    }
  }

  zoomImage(e: any) {
    const imageElem = document.getElementById('zoom-image');
    this.setState({
      zoomImageStyle: {
        top: - ((e.clientY - e.target.getBoundingClientRect().top) / e.target.clientHeight * (imageElem.clientHeight - e.target.clientHeight)) + 'px',
        left: - ((e.clientX - e.target.getBoundingClientRect().left) / e.target.clientWidth * (imageElem.clientWidth - e.target.clientWidth)) + 'px'
      }
    });
  }

  slideUp() {
    const imagesContainer = document.getElementById('images-container');
    const currentScrollTop = imagesContainer.scrollTop;
    const step = imagesContainer.scrollHeight / 200;
    for (let i = currentScrollTop; i >= 0; i = i - step) {
      setTimeout(() => imagesContainer.scrollTop = i, Math.abs(i - imagesContainer.scrollHeight) / step);
    }
    this.setState({ navigationDir: 'down' });
  }

  slideDown() {
    const imagesContainer = document.getElementById('images-container');
    const currentScrollTop = imagesContainer.scrollTop;
    const step = imagesContainer.scrollHeight / 200;
    for (let i = currentScrollTop; i <= imagesContainer.scrollHeight; i = i + step) {
      setTimeout(() => imagesContainer.scrollTop = i, i / step);
    }
    this.setState({ navigationDir: 'up' });
  }
  
  componentWillReceiveProps(nextProps: any) {
    // Manually set state because component does not update the state itself
    this.setState({ selectedImage: nextProps.images[0] });
  }

  render() {
    const settings = {
      responsive: [{
        breakpoint: 992,
        settings: {
          dots: true,
          infinite: false,
          speed: 300,
          slidesToShow: 1,
          slidesToScroll: 1,
          touchThreshold: 8
        }
      }, {
          breakpoint: 10000,
          settings: 'unslick'
      }]
    };
    return (
      <Row className={`${!this.props.available ? styles.totallyEmpty : ''} ${this.props.className}`}>
          <div className={`${styles.colLg2} ${styles.sliderContainer}`}>
              <div className={`hidden-md-down ${styles.slider}`}>
                  <div className={`ic-ic-arrow-up ${styles.imagesNavigation} ${styles.navigationUp} ${this.props.images.length > 6  && this.state.navigationDir === 'up' && styles.navigationShow || undefined}`} onClick={this.slideUp} />
                  <ul className={`list-unstyled ${styles.listThumbnailInner}`} id="images-container">
                    {this.props.images.map((image: string, index: number) => (
                      <li key={index} onMouseOver={() => {this.selectImage(image)}} className={`${styles.imageBorder} ${this.state.selectedImage === image ? styles.imageSelected : ''}`}>
                        <Image className={styles.image} filename={image} alt="" srcset={[90, 144]} sizes={['80px']}/>
                      </li>
                    ))}
                  </ul>
                  <div className={`ic-ic-arrow-down ${styles.imagesNavigation} ${styles.navigationDown} ${this.props.images.length > 6  && this.state.navigationDir === 'down' && styles.navigationShow || undefined}`} onClick={this.slideDown} />
              </div>
              <div className={`hidden-lg-up ${styles.sliderWrapper}`}>
                  <Slider {...settings}>
                    {this.props.images.map((image: string, index: number) => (
                      <Image key={index} className={styles.image} filename={image} alt="" srcset={[380, 640, 850]} />
                    ))}
                  </Slider>
                  <div className={styles.soldOutOverlay}>{this.props.t('products:SOLD_OUT')}</div>
              </div>
          </div>

          <div className={`hidden-md-down ${styles.colLg10}`}>
              <div className={styles.mainImage}>
                  <Image 
                    className={styles.image}
                    srcset={[580, 1030, 1080]}
                    filename={this.state.selectedImage}
                    alt="" />
                  <div className={styles.soldOutOverlay}>{this.props.t('products:SOLD_OUT')}</div>

                  <Image
                    id="zoom-image"
                    className={styles.zoomImage}
                    srcset={[1350, 1440]}
                    filename={this.state.selectedImage}
                    alt=""
                    style={this.state.zoomImageStyle} />
                  <div className={styles.overlay} onMouseMove={this.zoomImage} />
              </div>
          </div>
      </Row>
    );
  }
}

export default translate('products')(ImagesSlider);
