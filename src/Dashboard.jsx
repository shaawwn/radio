import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import useAuth from './hooks/useAuth';



import {getUser} from './utils/spotifyGetters';

function Dashboard({code}) {

    const accessToken = useAuth(code)
    const [user, setUser] = useState()

    
    useEffect(() => {
        if(accessToken) {
            // console.log("AccessToken", accessToken)
            getUser(accessToken, setUser)
        }
    }, [accessToken])
    return(
        <div className="dashboard">
            <p>Dashboard</p>
        </div>
    )
}

Dashboard.propTypes = {
    code: PropTypes.string.isRequired,
}

export default Dashboard;