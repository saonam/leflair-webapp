import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

import { Row } from '..';

import * as styles from './sale-timer.scss';

class SaleTimer extends Component<any, any> {
    interval: any;

    constructor(props: { time: Date, t?: Function, className?: string }) {
        super(props);

        this.state = {
            time: this.generateTimer()
        };

        // start timer
        this.interval = setInterval(() => {
            this.setState({
                time: this.generateTimer()
            });
        }, 1000);

        this.generateTimer = this.generateTimer.bind(this);
    }

    generateTimer() {
        const interval = new Date(this.props.time).getTime() - Date.now();
        const days = Math.floor(interval / 1000 / 60 / 60 / 24);
        const hours = Math.floor(interval / 1000 / 60 / 60 % 24);
        const minutes = Math.floor(interval / 1000 / 60 % 60);
        const seconds = Math.floor(interval / 1000 % 60);

        return { days: ('0' + days).slice(-2), hours: ('0' + hours).slice(-2), minutes: ('0' + minutes).slice(-2), seconds: ('0' + seconds).slice(-2) };
    }

    render() {
        return (
            <Row className={`${styles.timerRow} ${this.props.className || ''}`}>
                <div>
                    <div>{this.state.time.days}</div>
                    <div>{this.props.t('common:TIMER_DAYS')}</div>
                </div>
                <div>
                    <div>{this.state.time.hours}</div>
                    <div>{this.props.t('common:TIMER_HOURS')}</div>
                </div>
                <div>
                    <div>{this.state.time.minutes}</div>
                    <div>{this.props.t('common:TIMER_MINUTES')}</div>
                </div>
                <div>
                    <div>{this.state.time.seconds}</div>
                    <div>{this.props.t('common:TIMER_SECONDS')}</div>
                </div>
            </Row>
        );
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }
}

export default translate(['common'])(SaleTimer);
