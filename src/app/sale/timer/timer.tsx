import * as React from 'react';
import { Component } from 'react';
import { translate } from 'react-i18next';

class Timer extends Component<any, any> {
  interval: any;

  constructor(props: { time: Date, t: Function}) {
    super(props);

    const days = Math.floor((new Date(this.props.time).getTime() - Date.now()) / 1000 / 60 / 60 / 24);
    if (days > 0) {
      this.state = {
        time: `${days} ${props.t(`common:DAYS`)}`
      };
    } else {
      this.state = {
        time: this.generateTimer()
      };
      // start timer
      this.interval = setInterval(() => {
        this.setState({
          time: this.generateTimer()
        });
      }, 1000);
    }

    this.generateTimer = this.generateTimer.bind(this);
  }

  generateTimer() {
    const interval = new Date(this.props.time).getTime() - Date.now();
    const hours = Math.floor(interval / 1000 / 60 / 60);
    const minutes =  Math.floor(interval / 1000 / 60 % 60);
    const seconds = Math.floor(interval / 1000 % 60);
    return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
  }

  render() {
    return (
      <span>{this.state.time}</span>
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
}

export default translate(['common'])(Timer);
