
import PropTypes from 'prop-types';
function Login({authUrl}) {

    return(
        <main className="login">
            
            <a href={authUrl}>
                <p>Get Started</p>
            </a>
        </main>
    )
}

Login.propTypes = {
    authUrl: PropTypes.string.isRequired,
}
export default Login;