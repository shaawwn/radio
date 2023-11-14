
import {useRef} from 'react';
import PropTypes from 'prop-types';
import ToggleSwitch from '../src/components/ToggleSwitch'

function Login({authUrl}) {


    return(
        <>
            <header className="dashboard-header">
                <p></p>
                <p></p>
                <ToggleSwitch 
                    authUrl={authUrl}
                    radioOn={false}
                    />
            </header>
            <main className="login">
                <h1>Welcome to Radio!</h1>
            </main>
        </>
    )
}

Login.propTypes = {
    authUrl: PropTypes.string.isRequired,
}
export default Login;