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


import {getUser, getRecommendations} from './utils/spotifyGetters';

function Dashboard({code}) {
    // console.log("Loading dashboard")
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

    const [currentStation, setCurrentStation] = useState()
    const [currentTrack, setCurrentTrack] = useState()
    const timestamp = useRef(new Date()) // init a time onload
    
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

    function handleStationListChanges(title, trackList, playing) {
        // console.log(title, stationList[0], playing)
        let stationToUpdate = stationList.find((station) => station.title === title)
        let listCopy = [...stationList]
        let stationCopy = {...stationToUpdate}
        stationCopy['trackList'] = trackList
        stationCopy['playing'] = playing

        const index = stationList.indexOf(stationToUpdate)
        listCopy[index] = stationCopy
        // console.log(stationCopy.trackList, index, title, listCopy)
        setCurrentStation(stationCopy)
        setStationList(listCopy)
    }

    function updateCurrentPlaying(title, currentPlaying) {
        let stationListCopy = [...stationList]
        let stationToUpdate = stationList.find((station) => station.title === title)
        let stationCopy = {...stationToUpdate}
        let index = stationList.indexOf(stationToUpdate)
        stationCopy[currentPlaying] = currentPlaying
        stationListCopy[index] = stationCopy
        setStationList(stationListCopy)
        // setStationList((prevStationList) => {
        //     return prevStationList.map((station) => station.title === title ? stationToUpdate: station)
        // })
    }

    function updateTrackList(index, stationTitle) {
        // return a new trackList with the currentTrack at index 0, so if a song at index 3 is playing, the new TrackList woudl be length 17, this is for the purpose of passing it to webplayer, so that webplayer only has to play the index[0] song
            // This doesn't quite work, its not only setting the wrong station, but I think the setStation update re-renders everything
            const updatedStationList = [...stationList]

            const stationToUpdate = stationList.find((station) => station.title = stationTitle)
            const stationCopy = {...stationToUpdate}
            let updatedTrackList = stationCopy.trackList.slice(index + 1, stationCopy.trackList.length)

            const stationIndex = stationList.indexOf(stationToUpdate)
            console.log("STATION INDEX", stationIndex, stationTitle, stationList)
            stationCopy['trackList'] = updatedTrackList

            updatedStationList[stationIndex] = stationCopy

            console.log(stationCopy.trackList.length, stationToUpdate.trackList.length)
            setStationList(updatedStationList)
    }
    
    function displayStations() {
        return(
            <div className="station-container">
            {stationList.length > 0 ? 
            <>
                {stationList.map((station) => {
                    return <Station 
                        key={station.title}
                        accessToken={accessToken}
                        handleStationChange={handleStationChange}
                        station={station}
                        // handleStationListChanges={handleStationListChanges}
                        handleStationChanges={handleStationChanges}
                        // updateTrackList={updateTrackList}
                        // updateCurrentPlaying={updateCurrentPlaying}
                        setCurrentStation={setCurrentStation}
                    />
                })}
                </>
            :<p>No stations</p>
            }
            <div className="current-station">
                {currentStation ?  <CurrentStation station={currentStation}/> : <p>No station set.</p>}

            </div>
        </div>
        )
    }

    useEffect(() => {
        if(accessToken) {
            getUser(accessToken, setUser)
            // setCurrentStation(stationList[0]) 
        }
    }, [accessToken])
    
    return(
        <div className="dashboard">
            <div className="dashboard-header">
                <p>Welcome {user ? ', ' + user.display_name : ''}</p>
            </div>


            {/* Some navbar with user information */}

            {/* Station Container, for holding station component, as well as viewing currentStation */}
            {accessToken ? displayStations() : <p>Loading stations...</p>}
            {/* <div className="station-container">
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
            </div> */}

            {/* Player for playing station content */}
            {accessToken ? <Webplayer 
                accessToken={accessToken}
            />
            :null}
        </div>
    )
}


Dashboard.propTypes = {
    code: PropTypes.string.isRequired,
}

export default Dashboard;