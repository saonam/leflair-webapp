import * as React from 'react';

import { Grid, Image, Link, LazyImage } from '../../common';

import * as styles from './upcoming-sales.scss';

const SaleTile = (props: any) => (
    <Link className={styles.upSaleTileContainer} path={`/sales/upcoming/${props.data.slug}`}>
        <div className={styles.imageContainer}>
            <LazyImage 
                filename={props.data.image} 
                srcset={[300, 580, 850]} 
                sizes={['(max-width: 575px) calc(50vw - 18px)', '(max-width: 767px) 166px', '(max-width: 991px) 156px', '(max-width: 1200px) 216px', '261px']} 
                alt={props.data.title} square={true} 
                lazyLoadImageType={styles.upcomingSalePlaceholder} />
        </div>
        <div className={styles.titleContainer}>
            <h4 className={styles.title}>{props.data.title}</h4> 
        </div>
    </Link>
);

class UpcomingSales extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            activeIndex: 0
        };
    }

    resolvePanelClass(key: number) {
        if (this.state.activeIndex === key) {
            return styles.activePanel;
        }

        return styles.panel;
    }

    resolveSelectorClass(key: number) {
        if(this.state.activeIndex === key) {
            return styles.activeSelector;
        }

        return styles.dateSelector;
    }

    selectPanel(key: number) {
        return (e: any) => {
            e.preventDefault();
            this.setState({
                activeIndex: key
            });
        };
    }

    render() {
        return (
            <div>
                <div className={styles.dateSelectorContainer}>
                    { this.props.data.map((day: any, key: number) => (
                        <a key={key} href="#" className={this.resolveSelectorClass(key)} onClick={this.selectPanel(key)}>{day.date}</a>
                    )) }

                    <div className={styles.sectionSeparator} > </div>
                </div>
                <div className={styles.upSalesSectionContainer}>
                    { this.props.data.map((day: any, key: number) => (
                        <div key={key} className={this.resolvePanelClass(key)}>
                            <Grid columns={({
                                md: 4,
                                sm: 3,
                                xs: 2
                            })} component={SaleTile} data={day.sales} className={styles.upSaleWrap}/>
                        </div>
                    )) }
                </div>
            </div>
        );
    }
}

export default UpcomingSales;
