import {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import useAuth from './hooks/useAuth';
import useStations from './hooks/useStations';
import audio from './tuning.mp3'
const tuning = new Audio(audio)

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRecordVinyl } from '@fortawesome/free-solid-svg-icons'

// Component apps
import Station from './components/Station';
import Webplayer from './components/Webplayer';
import CurrentStation from './components/CurrentStation';
import ToggleSwitch from './components/ToggleSwitch';
import Carousel from './components/Carousel';

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
                "artists": ["3V79CTgRnsDdJSTqKitROv,7cGkvEcOOYVtNdfkf3s1tK,6dOnTTVTbQlFWF6yfD4Vw5,1CRvJnCbPjgx0xmBdoex0c,0JuWnarwRTjiTfY5zOuOfH"],
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
                "genres": [
                ],
                "artists": [
                ],
                "tracks": ["3CIOopLwvyMvXk97ZEksKO,57fqmDaokbxZ3TaB0jp39q,0mgwfP6fcg3t0PPVoKXrF8,4f3RDq9nYPBeR1yMSgnmBm,2Cg5XzRsGO2VYbaUYN2j8i"]
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
                "tracks": ["1Sgj10byiGzPpI2IrXSFEn,6904O7JrAxFybd4yu3Sz2V,0trHOzAhNpGCsGBEu7dOJo,4dmh3OPtAhbEybhGoOG9TE,7mYZUhCy77Aox1vIMTfuve"]
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
        {
            "title": "KUNT",
            "desc": "Classic Country",
            "trackList": [],
            "seeds": {
                "genres": [],
                "artists": ["1FClsNYBUoNFtGgzeG74dW,6kACVPfCOnqzgfEF5ryl0x,1RP2UpEaRzkF0Id3JigqD8,7wCjDgV6nqBsHguQXPAaIM"],
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
            "title": "KJZZ",
            "desc": "Jazz",
            "trackList": [],
            "seeds": {
                "genres": ["jazz"],
                "artists": [
                    "1VEzN9lxvG6KPR3QQGsebR,7AbWCUgC8aFlUYWSuiaQhK,0kbYTNQb4Pb1rPbbaF0pT4,4PDpGtF16XpqvXxsrFwQnN"
                ],
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
            "title": "KPRG",
            "desc": "Prog Rock",
            "trackList": [],
            "seeds": {
                "genres": [],
                "artists": [
                    "2Hkut4rAAyrQxRdof7FVJq,64mPnRMMeudAet0E62ypkx,7AC976RDJzL2asmZuz7qil,7M1FPw29m5FbicYzS2xdpi"
                ],
                "tracks": ["1bPUK3zBMK73QXmCLzqffn"]
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
            "title": "WKHP",
            "desc": "Indie and Alternative",
            "trackList": [],
            "seeds": {
                "genres": [],
                "artists": ['4Z8W4fKeB5YxbusRsdQVPb,6olE6TJLqED3rqDCT0FyPh,6zvul52xwTWzilBZl6BUbT,5UqTO8smerMvxHYA5xsXb6'],
                "tracks": ['5PntSbMHC1ud6Vvl8x56qd']
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
    const accessToken = useAuth(code)
    const [user, setUser] = useState()
    const [screenWidth, setScreenWidth] = useState()
    const [stationList, setStationList] = useState(DEFAULT_STATIONS)

    const [currentStation, setCurrentStation] = useState()
    const currentStationRef = useRef()
    const currentTrackRef = useRef({track: null, progress_ms: null, timestamp: 0}) // used to webplayer track changes
    const stationRef = useRef({title: ''})
    const timestampRef = useRef()
    const toSync = useRef(false)
    const webplayerTimestamp = useRef([])


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
        tuning.play() 
        let stationToUpdate = stationList.find((station) => station.title === title)
        let listCopy = [...stationList]
        let stationCopy = {...stationToUpdate}

        stationCopy['trackList'] = trackList
        stationCopy['playing'] = playing
        stationCopy['current'] = true
        const index = stationList.indexOf(stationToUpdate)
        listCopy[index] = stationCopy
        if(toSync.current === true) { // this gets set regardless, if there are two sync stations
            const currentStationObj = stationList.find((station) => station.title === currentStation.title)
            const toUpdate = updateStationOnChange() 
            toUpdate['current'] = false
            const updateIndex = stationList.indexOf(currentStationObj)
            listCopy[updateIndex] = toUpdate
            toSync.current = false
        } 
        setCurrentStation(stationCopy) 
        setStationList(listCopy)
    }
    
    function displayStations() {

        // Put carousel here, and stations inside
        return(
            <div className="station-container__wrapper">
                <Carousel stations={stationList} />
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
                            timestampRef={timestampRef}
                            toSync={toSync}
                            webplayerTimestamp={webplayerTimestamp}
                        />
                    })}
                    
                </>
                :<p>No stations</p>
                }
            </nav>
        </div>
        )
    }


    function updateStationOnChange() {
        let toUpdate = {...currentStation}
        const currentTime = new Date().getTime()
        webplayerTimestamp.current.push({title: toUpdate.title, timestamp: currentTime})
        // webplayerTimestamp.current = {title: toUpdate.title, timestamp: currentTime} // this sets the timestamp for the song (because it doesn't get set in station)
        const timeElapsed = currentTime - timestampRef.current // this is being reset when a new song plays
        let track;
        try {
            track = toUpdate.trackList.find((track) => track.id === currentTrackRef.current.track.id)
            if(!track) {
                track = toUpdate.trackList.find((track) => track.name === currentTrackRef.current.track.name)
            }
            // console.log("TRACK TO UPDATE", track.name)
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
        if(accessToken && !user) {
            getUser(accessToken, setUser)
        } else {
            console.log("...", accessToken)
        }

        if(!screenWidth) {
            let screenSize = window.innerWidth
            setScreenWidth(screenSize)
            window.addEventListener('resize', () => {
                screenSize = window.innerWidth;
                setScreenWidth(screenSize)
            })
        }
    }, [accessToken])
    

    return(
        <main className="dashboard">
            {accessToken && currentStation ? <Webplayer 
                accessToken={accessToken}
                station={currentStation}
                currentTrackRef={currentTrackRef}
                timestampRef={timestampRef}
                toSync={toSync}
            />
            :<article className="current-station">
                <div className="flex-wrapper flex-wrapper--center">
                        <div className="current-station__track-details__image__wrapper">
                            <FontAwesomeIcon icon={faRecordVinyl} className="webplayer__skeleton__image" />
                        </div>
                    </div>
            </article>
            }

            {accessToken ? 
            <div className="station-container__wrapper">
                <nav className="station-container">
                {stationList.length > 0 ? 
                <>
                    {/* {stationList.map((station) => {
                        return <Station 
                            key={station.title}
                            accessToken={accessToken}
                            handleStationChange={handleStationChange}
                            station={station}
                            handleStationChanges={handleStationChanges}
                            timestampRef={timestampRef}
                            toSync={toSync}
                            webplayerTimestamp={webplayerTimestamp}
                        />
                    })} */}
                    <Carousel 
                        stations={stationList}
                        accessToken={accessToken}
                        handleStationChange={handleStationChange}
                        handleStationChanges={handleStationChanges}
                        timestampRef={timestampRef}
                        toSync={toSync}
                        webplayerTimestamp={webplayerTimestamp}
                        screenWidth={screenWidth}
                    />
                </>
                :<p>No stations</p>
                }
                
                </nav>
            </div>
            : <p>Loading stations...</p>}
        </main>
    )
}


Dashboard.propTypes = {
    code: PropTypes.string.isRequired,
}

export default Dashboard;