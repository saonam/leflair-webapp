import * as React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { setAlert, getAlerts, removeAlert } from '../../redux/alert.redux';

import * as styles from './alert.scss';

type AlertProps = {
    setAlert: Function,
    removeAlert: Function,
    t?: Function,
    children?: any,
    other: any
};

class Alert extends React.Component<any, any> {
    constructor(props: AlertProps) {
        super(props);
        this.state = {
            invisibleAlert: []
        }

        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.props.alerts && this.props.alerts.length) {
                this.props.alerts.forEach((alert: any, index: number) => {
                    if (alert.timeOut) {
                        setTimeout(() => this.props.removeAlert(index), alert.timeOut);
                    }
                });
            }
        }, 300);
    }

    handleClose(index: number) {
        this.props.removeAlert(index);
    }

    render() {
        return (
            <div>
                {this.props.alerts && this.props.alerts.length ? this.props.alerts.map((alert: any, index: number) => 
                    <div
                        key={index}
                        className={`${styles.alertBar} ${this.props.type === 'error' ? styles.errorBar : styles.successBar} ${alert.isVisible ? styles.show : styles.hide}`}
                        {...this.props.other}
                    >
                        {this.props.t(`common:${alert.message}`, alert.messageValue)}
                        <i className={`ic-ic-close ${styles.close} ${!alert.timeOut ? styles.closeVisible : styles.closeInvisible}`} onClick={() => this.handleClose(index)} />
                        {this.props.children}
                    </div>
                ) : null}
            </div>
        );
    }
}

const ConnectedAlert = connect(
    (state) => ({
        alerts: getAlerts(state)
    }), {
        setAlert,
        removeAlert
    }
)(Alert as any);

export default translate('common')(ConnectedAlert as any);
