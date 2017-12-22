import * as React from 'react';
import { SFC } from 'react';
import { connect } from 'react-redux';

import { getCurrentLang } from '../redux/user.redux';

const TranslateImage: SFC<any> = (props) => {
    const {currentLang, sources, defaultSrc, ...other} = props;

    return <img src={sources[currentLang] || defaultSrc} {...other} />
}

export default connect(
    (state) => ({
        currentLang: getCurrentLang(state)
    })
)(TranslateImage) as any;
