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
                    'hard-rock',
                    'heavy-metal'
                ],
                "artists": [
                    '5M52tdBnJaKSvOpJGz8mfZ',
                    '1DFr97A9HnbV3SKTJFu62M',
                    '3qm84nBOXUEQ2vnTfUTTFC'
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
            "title": "KRAP",
            "desc": "90s rap",
            "trackList": [],
            "seeds": {
                "genres": [],
                "artists": ["34EP7KEpOjXcM2TCat1ISk,20qISvAhX20dpIbOOzGK3q,5me0Irg2ANcsgc93uaYrpb,099tLNCZZvtjC7myKD0mFp,6Mo9PoU6svvhgEum7wh2Nd"],
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
        {
            "title": "KUNT",
            "desc": "Classic Country",
            "trackList": [],
            "seeds": {
                "genres": ['honky-tonk'],
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
    const [screenWidth, setScreenWidth] = useState()
    // default stations


    const [stationList, setStationList] = useState(DEFAULT_STATIONS)

    const [currentStation, setCurrentStation] = useState()

    // const [stationList, currentStation, handleStationChanges, currentTrackRef, changeStation] = useStations(accessToken)
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
        tuning.play() // uncomment when pushing live
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
            // console.log("TO UPDATE", toUpdate)
            toSync.current = false
            // console.log("SETTING TO SYNC", toSync.current)
        } 
        setCurrentStation(stationCopy) // currentStation should be KRPG, but change to KHRD here, the problem is if toSync, it stays on KRPG
        setStationList(listCopy)
    }
    
    function displayStations() {
        return(
            <div className="station-container__wrapper">


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
                {/* <div className="current-station">
                    {currentStation ?  <CurrentStation station={currentStation}/> : <p>No station set.</p>}
                </div> */}
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

    function mobileLayout() {
        // track details at top

        // station carousel at bottom
        return(
            <>

                {accessToken && currentStation ? 
                    <Webplayer 
                    accessToken={accessToken}
                    station={currentStation}
                    currentTrackRef={currentTrackRef}
                    timestampRef={timestampRef}
                    toSync={toSync}
                    />
                :null}
                {accessToken ? displayStations() : <p>Loading stations...</p>}
            </>
        )
    }

    function desktopLayout() {
        console.log("DESKTOP")
        return(
            <>
                {accessToken ? displayStations() : <p>Loading stations...</p>}
                {accessToken && currentStation ? 
                    <Webplayer 
                    accessToken={accessToken}
                    station={currentStation}
                    currentTrackRef={currentTrackRef}
                    timestampRef={timestampRef}
                    toSync={toSync}
                    />
                :null}
            </>
        )
    }
    useEffect(() => {
        if(accessToken && !user) {
            console.log("ACCESS TOKEN USER", user)
            getUser(accessToken, setUser)
            // setCurrentStation(stationList[0]) 
        } else {
            console.log("...", accessToken)
        }

        if(!screenWidth) {
            let screenSize = window.innerWidth
            setScreenWidth(screenSize)
            window.addEventListener('resize', () => {
                screenSize = window.innerWidth;
                setScreenWidth(screenSize)
                console.log("RESIZE", screenSize)
            })
        }
    }, [accessToken])
    

    return(
        <main className="dashboard">
            <header className="dashboard-header">
                <p>Welcome {user ? ', ' + user.display_name : ''}</p>
                <p></p>
                <ToggleSwitch 
                    accessToken={accessToken} 
                    radioOn={true}
                    />
            </header>
            {/* {accessToken ? displayStations() : <p>Loading stations...</p>} */}

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
            : <p>Loading stations...</p>}
        </main>
    )
}


Dashboard.propTypes = {
    code: PropTypes.string.isRequired,
}

export default Dashboard;