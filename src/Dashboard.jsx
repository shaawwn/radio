import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import useAuth from './hooks/useAuth';
import useStations from './hooks/useStations';


// Component apps
import Station from './components/Station';
import Webplayer from './components/Webplayer';
import CurrentStation from './components/CurrentStation';

// mocks
import exampleRecs from './rec_example.json';
import exampleRecs2 from './rec_example.json';
import punk from './punk.json';
import rap from './rap.json';

import {getUser, getRecommendations} from './utils/spotifyGetters';


let DEFAULT_STATIONS = [
        {
            "title": "KRPG",
            "desc": "Mix of new and old JRPG music",
            "trackList": [],
            "seeds": {
                "genres": [],
                "artists": ["3V79CTgRnsDdJSTqKitROv"],
                "tracks": []
            },
            "current": false,
            "playing": {
                "track": {
                    "name": "radioStatic",
                    "progress_ms": 0
                }
            }
        },
        {
            "title": "KHRD",
            "desc": "Hard rock and metal",
            "trackList": [],
            "seeds": {
                "genres": [],
                "artists": ['6dOnTTVTbQlFWF6yfD4Vw5',
                '7cGkvEcOOYVtNdfkf3s1tK',
                '63JXuvboeORZFlNVoivVLT',
                '0oSGxfWSnnOXhD2fKuz2Gy'],
                "tracks": []
            },
            "current": false,
            "playing": {
                "track": {
                    "name": "radioStatic",
                    "progress_ms": 0
                }
            }
        },
        {
            "title": "KRAP",
            "desc": "90s rap",
            "trackList": [],
            "seeds": {
                "genres": [],
                "artists": [],
                "tracks": []
            },
            "current": false,
            "playing": {
                "track": {
                    "name": "radioStatic",
                    "progress_ms": 0
                }
            }
        },
        {
            "title": "KPNK",
            "desc": "Harcore Punk",
            "trackList": [],
            "seeds": {
                "genres": [],
                "artists": [],
                "tracks": []
            },
            "current": false,
            "playing": {
                "track": {
                    "name": "radioStatic",
                    "progress_ms": 0
                }
            }
        },
        {
            "title": "KUNT",
            "desc": "Classic Country",
            "trackList": [],
            "seeds": {
                "genres": [],
                "artists": [],
                "tracks": []
            },
            "current": false,
            "playing": {
                "track": {
                    "name": "radioStatic",
                    "progress_ms": 0
                }
            }
        },
        {
            "title": "KUST",
            "desc": "Custom user created station",
            "trackList": [],
            "seeds": {
                "genres": [],
                "artists": [],
                "tracks": []
            },
            "current": false,
            "playing": {
                "track": {
                    "name": "radioStatic",
                    "progress_ms": 0
                }
            }
        },
    ]

function Dashboard({code}) {
    // console.log("Loading dashboard", code)
    const accessToken = useAuth(code)
    const [user, setUser] = useState()

    // default stations
    const [stationList, setStationList] = useState([
        {title: 'vgm', trackList: [], seeds: {'genres': [], artists: [
            '3V79CTgRnsDdJSTqKitROv',
        ], tracks: []
    }, current: true, playing: {track: {name: 'radioStatic'}}}, 
        {title: 'rock', trackList: [], seeds: {'genres': [], artists: [
            '6dOnTTVTbQlFWF6yfD4Vw5',
            '7cGkvEcOOYVtNdfkf3s1tK',
            '63JXuvboeORZFlNVoivVLT',
            '0oSGxfWSnnOXhD2fKuz2Gy'], tracks: []
    }, current: false, playing: {track: {name: "radioStatic"}}}
    ])

    // const [stationList, setStationList] = useState(DEFAULT_STATIONS)

    const [currentStation, setCurrentStation] = useState()
    
    function handleStationChange(title) {

        if(title === currentStation.title) {
            return false // do nothing
        }

        let currentStationCopy = {...currentStation}
        currentStationCopy.current = false

        let newCurrent = stationList.find((station) => station.title === title)
        newCurrent.current = true 

        let stationListCopy = [...stationList]

        const indexCurrent = stationList.indexOf(currentStation)
        const indexNew = stationList.indexOf(newCurrent)

        stationListCopy[indexCurrent] = currentStationCopy
        stationListCopy[indexNew] = newCurrent

        setCurrentStation(newCurrent)
        setStationList(stationListCopy)

    }

    function handleStationChanges(title, trackList, playing) {
        // when station changes song, update the track list and playing attribntues
        let stationToUpdate = stationList.find((station) => station.title === title)
        let listCopy = [...stationList]
        let stationCopy = {...stationToUpdate}
        stationCopy['trackList'] = trackList
        stationCopy['playing'] = playing

        const index = stationList.indexOf(stationToUpdate)
        listCopy[index] = stationCopy
        setCurrentStation(stationCopy)
        setStationList(listCopy)
    }
    
    function displayStations() {
        return(
            <nav className="station-container">
            {stationList.length > 0 ? 
            <>
                {stationList.map((station) => {
                    return <Station 
                        key={station.title}
                        accessToken={accessToken}
                        handleStationChange={handleStationChange}
                        station={station}
                        handleStationChanges={handleStationChanges}
                        setCurrentStation={setCurrentStation}
                    />
                })}
                </>
            :<p>No stations</p>
            }
            {/* <div className="current-station">
                {currentStation ?  <CurrentStation station={currentStation}/> : <p>No station set.</p>}
            </div> */}
        </nav>
        )
    }

    useEffect(() => {
        if(accessToken) {
            // console.log("ACCESS TOKEN", accessToken)
            getUser(accessToken, setUser)
            // setCurrentStation(stationList[0]) 
        }
    }, [accessToken])
    
    return(
        <main className="dashboard">
            <header className="dashboard-header">
                <p>Radio</p>
                <p>Welcome {user ? ', ' + user.display_name : ''}</p>
            </header>
            {/*  */}

            {/* Station Container, for holding station component, as well as viewing currentStation */}

            {accessToken ? displayStations() : <p>Loading stations...</p>}

            {currentStation ? <CurrentStation station={currentStation}/> :<p>No station set.</p>}


            {/* Player for playing station content */}
            {accessToken ? <Webplayer 
                accessToken={accessToken}
            />
            :null}
        </main>
    )
}


Dashboard.propTypes = {
    code: PropTypes.string.isRequired,
}

export default Dashboard;