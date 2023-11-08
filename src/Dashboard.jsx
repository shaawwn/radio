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
import { faBedPulse } from '@fortawesome/free-solid-svg-icons';


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
            "current": true,
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
                "artists": ["5me0Irg2ANcsgc93uaYrpb", "20qISvAhX20dpIbOOzGK3q", "5Rzqmz1zAszembFHGZQuAt", "6ns6XAOsw4B0nDUIovAOUO", "2WKdxPFRD7IqZvlIAvhMgY"],
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
                "artists": ["0mGyXXKzoR5KAAh4Mkef2W","54NqjhP2rT524Mi2GicG4K","5Sn4sDRaxbilWiTNmuUuqU", "30U8fYtiNpeA5KH6H87QUV", "5105k1OIV9BdhuB3rxtHYb"],
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
        // {
        //     "title": "KUNT",
        //     "desc": "Classic Country",
        //     "trackList": [],
        //     "seeds": {
        //         "genres": [],
        //         "artists": [],
        //         "tracks": []
        //     },
        //     "current": false,
        //     "playing": {
        //         "track": {
        //             "name": "radioStatic",
        //             "progress_ms": 0
        //         }
        //     }
        // },
        // {
        //     "title": "KUST",
        //     "desc": "Custom user created station",
        //     "trackList": [],
        //     "seeds": {
        //         "genres": [],
        //         "artists": [],
        //         "tracks": []
        //     },
        //     "current": false,
        //     "playing": {
        //         "track": {
        //             "name": "radioStatic",
        //             "progress_ms": 0
        //         }
        //     }
        // },
    ]

function Dashboard({code}) {
    // console.log("Loading dashboard")
    const accessToken = useAuth(code)
    const [user, setUser] = useState()

    // default stations


    const [stationList, setStationList] = useState(DEFAULT_STATIONS)

    const [currentStation, setCurrentStation] = useState()
    const currentStationRef = useRef()
    const currentTrackRef = useRef({track: null, progress_ms: null, timestamp: 0}) // used to webplayer track changes
    const stationRef = useRef({title: ''})
    const timestampRef = useRef()
    const toSync = useRef(false)


    function handleStationChange(title) {
        // this changes what the current station is nothing more
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

        // setCurrentStation(newCurrent)  // THIS WAS CAUSING RE-RENDER
        setStationList(stationListCopy)
    }

    function handleStationChanges(title, trackList, playing) {
        // when station changes song, update the track list and playing attribntues
        // this only runs when station is changed, not on track change

        // therefore, if tracks have been running via webplayer, on station change need to log the changes between when the stationList was last updated with what the track list and track currently are at, this is done in updateStationOnChange
        
        // but only updateStationOnChange for the previous station
        // console.log("Changing to: ", title)

        let stationToUpdate = stationList.find((station) => station.title === title)
        let listCopy = [...stationList]
        let stationCopy = {...stationToUpdate}

        stationCopy['trackList'] = trackList
        stationCopy['playing'] = playing
        // stationCopy['current'] = true
        const index = stationList.indexOf(stationToUpdate)
        listCopy[index] = stationCopy
        // console.log("Station copy: ", stationCopy.title)
        if(toSync.current === true) { // this gets set regardless
                    const currentStationObj = stationList.find((station) => station.title === currentStation.title)
                    const toUpdate = updateStationOnChange() // a copy of the currentStation BEFORE settign to the new station (KRPG -> KHRD, it copies KRPG)
                    // toUpdate['current'] = false
                    const updateIndex = stationList.indexOf(currentStationObj)
                    listCopy[updateIndex] = toUpdate
                    toSync.current = false
                    // console.log("toUpdate", toUpdate.title, stationCopy.title)
                    // stationCopy should be KHRD, where toUpdate should be KRPG


        }

        // console.log("Setting current to: ", stationCopy.title)
        setCurrentStation(stationCopy) // setting to this?
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
                        timestampRef={timestampRef}
                        toSync={toSync}
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


    function updateStationOnChange() {
        // eg if user listening to station for x amount of songs, the staitonList is actually not updating as of now.
        // isntead, maybe on station change to a different station, record that station status (check the current song playing, log the progress, update the state list), then change to the new station, or include it as part of the stationlist update
        // use currentTrackRef which is the song from the station that was last changed
        let toUpdate = {...currentStation}
        const currentTime = new Date().getTime()
        const timeElapsed = currentTime - timestampRef.current
        let track;
        try {
            track = toUpdate.trackList.find((track) => track.id === currentTrackRef.current.track.id)
            if(!track) {
                track = toUpdate.find((track) => track.name === currentTrackRef.current.track.name)
            }
        } catch {
            // do nothing
            return toUpdate
        }
        const index = toUpdate.trackList.indexOf(track)
        toUpdate.trackList = toUpdate.trackList.slice(index, toUpdate.trackList.length)
        toUpdate['playing'] = {
            track: track,
            progress_ms: timeElapsed 
        }
        return toUpdate
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

            {/* {currentStation ? <CurrentStation station={currentStation}/> :<p>No station set.</p>} */}

            {accessToken && currentStation ? <Webplayer 
                accessToken={accessToken}
                station={currentStation}
                handleStationChanges={handleStationChanges}
                currentTrackRef={currentTrackRef}
                timestampRef={timestampRef}
                toSync={toSync}
            />
            :null}
        </main>
    )
}


Dashboard.propTypes = {
    code: PropTypes.string.isRequired,
}

export default Dashboard;