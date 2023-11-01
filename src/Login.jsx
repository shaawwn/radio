
import PropTypes from 'prop-types';
function Login({authUrl}) {

    return(
        <div className="login">
            
            <a href={authUrl}>
                <p>Get Started</p>
            </a>
        </div>
    )
}

Login.propTypes = {
    authUrl: PropTypes.string.isRequired,
}
export default Login;