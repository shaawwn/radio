
import {useRef} from 'react';
import PropTypes from 'prop-types';
import ToggleSwitch from '../src/components/ToggleSwitch'

function Login({authUrl}) {

    function redirectLogin() {
        console.log("Logging in")
        setTimeout(() => {
            window.location.href=authUrl
        }, 150)
    }

    function logOut() {
        console.log("Logging out")
    }
    return(
        <main className="login">
            <header className="dashboard-header">
                <p>Radio</p>
                <p>Welcome</p>
                <ToggleSwitch 
                    authUrl={authUrl}
                    radioOn={false}
                    />
            </header>
            {/* <ToggleSwitch 
                authUrl={authUrl}
                radioOn={false}
            /> */}
        </main>
    )
}

Login.propTypes = {
    authUrl: PropTypes.string.isRequired,
}
export default Login;