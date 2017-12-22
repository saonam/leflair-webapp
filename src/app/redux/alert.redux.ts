/* TYPES */

export const SET_ALERT = 'alert/SET_ALERT';
export const REMOVE_ALERT = 'alert/REMOVE_ALERT';

const initialState= {};

/* ACTIONS */
export const setAlert = (alert: { isVisible: boolean, message?: string, messageValue?: Object, timeOut?: number }) => {
    return async (dispatch: Function) => {
        dispatch({
            type: SET_ALERT,
            alert
        });
    }
}

export const removeAlert = (index: number) => {
    return async (dispatch: Function) => {
        dispatch({
            type: REMOVE_ALERT,
            index
        });
    }
}

/* REDUCER */

export const alertReducer = (state: any, action: { type: string, alert: any, index: number }) => {
    switch (action.type) {
        case SET_ALERT:
            const alerts = getAlerts(state) || [];
            alerts.push(action.alert);
            return {
                ...state,
                alerts
            }
        case REMOVE_ALERT:
            const allAlerts = getAlerts(state) || [];
            if (allAlerts.length) {
                allAlerts.splice(action.index, 1);
            } 
            return {
                ...state,
                alerts: allAlerts
            }
                
        default:
            return state || initialState;
    }
}


/* SELECTORS */
export const getAlerts = (state: any) => state.alert && state.alert.alerts;
