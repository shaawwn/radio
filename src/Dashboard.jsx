import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import useAuth from './hooks/useAuth';
import useStations from './hooks/useStations';


// Component apps
import Station from './components/Station';
import Webplayer from './components/Webplayer';

// mocks
import exampleRecs from './rec_example.json';
import exampleRecs2 from './rec_example.json';


import {getUser, getRecommendations} from './utils/spotifyGetters';

function Dashboard({code}) {

    const accessToken = useAuth(code)
    const [user, setUser] = useState()

    // default stations
    const [stationList, setStationList] = useState([
        {title: 'vgm', trackList: [], seeds: {'genres': [], artists: [
            '3V79CTgRnsDdJSTqKitROv',
        ], tracks: []
    }, current: true}, 
        {title: 'rock', trackList: [], seeds: {'genres': [], artists: [
            '6dOnTTVTbQlFWF6yfD4Vw5',
            '7cGkvEcOOYVtNdfkf3s1tK',
            '63JXuvboeORZFlNVoivVLT',
            '0oSGxfWSnnOXhD2fKuz2Gy'], tracks: []
    }, current: false}
    ])


    const [currentStation, setCurrentStation] = useState()
    const time = useRef(0)


    function handleStationChange(stationTitle) {
        // when a station is clicked, set it to the active station and handle all the playback changes, etc
        if(stationTitle === currentStation.title) {
            return false
        }
        setCurrentStation(stationList.find((station) => station.title === stationTitle))
        // set Current station to false

        // set new station to current
        let currentCopy = {...currentStation}
        currentCopy.current = false

        let newStation = stationList.find((station) => station.title === stationTitle)
        newStation.current = true

        setStationList((prevStationList) => {
            let newStationObj = [...prevStationList]

            newStationObj.map((station) => station.title === currentCopy.title ? currentCopy : station)
            newStationObj.map((station) => station.title === newStation.title ? newStation: station)

            return newStationObj
        })
        console.log("NEW STATION: ", newStation)
        setCurrentStation(newStation)
    }


    function handleStationListChanges(title, trackList) {
        // update the stationList with changes to individual stations, mostly updating trackList or seeds
        let stationToUpdate = stationList.find((station) => station.title === title)
        stationToUpdate['trackList'] = trackList
        setStationList((prevStationList) => {
            return prevStationList.map((station) => station.title === title ? stationToUpdate : station)
        })
    }

    function printTrackListLength() {

        stationList.forEach((station) => {
            console.log("TRACK LIST LENGTH: ", station.trackList.length)
        })
    }
    useEffect(() => {
        if(accessToken) {
            getUser(accessToken, setUser)
            setCurrentStation(stationList[0])
        }
    }, [accessToken])

    printTrackListLength()
    return(
        <div className="dashboard">
            <p>Welcome {user ? ', ' + user.display_name : ''}</p>

            {/* Some navbar with user information */}

            {/* Station Container, for holding station component, as well as viewing currentStation */}
            <div className="station-container">
                {stationList.length > 0 ? 
                <>
                    {stationList.map((station) => {
                        return <Station 
                            key={station.title}
                            accessToken={accessToken}
                            handleStationChange={handleStationChange}
                            station={station}
                            handleStationListChanges={handleStationListChanges}
                        />
                    })}
                    </>
                :<p>No stations</p>
                }
                <div className="current-station">
                    {currentStation ?  <CurrentStation station={currentStation}/> : <p>No station set.</p>}

                </div>
            </div>

            {/* Player for playing station content */}
            {accessToken ? <Webplayer 
                accessToken={accessToken}
            />
            :null}
        </div>
    )
}

function CurrentStation({station}) { 

    useEffect(() => {
        console.log("STATION", station)
    }, [station])

    return(
        <>
        <p style={{'fontSize': '3rem'}}>{station.title}</p>
        </>
    )
}
Dashboard.propTypes = {
    code: PropTypes.string.isRequired,
}

export default Dashboard;