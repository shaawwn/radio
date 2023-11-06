import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import exampleRecs from '../rec_example.json';
import exampleRecs2 from '../rec_example2.json';


function Station({accessToken, setStations, handleStationChange, station, qsetCurrentStation, handleStationChanges}) {
    // console.log("Loading", station.title, station.trackList)
    // const [trackList, setTrackList] = useState([])
    const [currentTrack, setCurrentTrack] = useState(null) // shoudl be {track: <SPOTIFYOBJ>, progress_ms: <genProgress()>}
    const [timestamp, setTimestamp] = useState()

    function mockGetTrackList() {
        if(station.title === 'vgm') {
            const _currentTrack = {
                track: exampleRecs.tracks[0],
                progress_ms: Math.floor(Math.random() * exampleRecs.tracks[0].duration_ms)
            }
            setCurrentTrack(_currentTrack)
            handleStationChanges(station.title, exampleRecs.tracks, _currentTrack)
            let ts = new Date().getTime()
            setTimestamp(ts) // this function runs the first time a station is switched to, so set a timestamp for when the currenTrack starts
        } else {
            const _currentTrack = {
                track: exampleRecs2.tracks[0],
                progress_ms: Math.floor(Math.random() * exampleRecs2.tracks[0].duration_ms)
            }
            setCurrentTrack(_currentTrack)
            handleStationChanges(station.title, exampleRecs2.tracks, _currentTrack)
            let ts = new Date().getTime()
            setTimestamp(ts) // this function runs the first time a station is switched to, so set a timestamp for when the 
        }
    }

    function getTrackList() {
        // all initialization stuff when the station first loads
        // fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${station.seeds.genres}&seed_artists=${station.seeds.artists}&seed_tracks=${station.seeds.tracks}
        // `, {
        //     headers: {
        //         'Authorization': `Bearer ${accessToken}`
        //     }
        // }).then(res => res.json())
        // .then((data) => {
        //     // console.log("RECOMMENDATIONS from Station", data.tracks, station)

        //     // however, only set the track if there is no existing track
        //     if(currentTrack !== null) {
        //         checkCurrentTrackAgainstTimestamp()
        //     }
        //     setCurrentTrack({
        //         track: data.tracks[0],
        //         progress_ms: Math.floor(Math.random() * data.tracks[0].duration_ms)
        //     })
        //     let ts = new Date().getTime()
        //     setTimestamp(ts) // this function runs the first time a station is switched to, so set a timestamp for when the currenTrack starts
        //     handleStationListChanges(station.title, data.tracks)
        // })


        // MOCK


        if(station.title === 'vgm') {
            // setTrackList(exampleRecs.tracks)
            // handleStationListChanges(station.title, exampleRecs.tracks)
            const _currentTrack = {
                track: exampleRecs.tracks[0],
                progress_ms: Math.floor(Math.random() * exampleRecs.tracks[0].duration_ms)
            }
            setCurrentTrack(_currentTrack)
            // handleStationListChanges(station.title, exampleRecs.tracks, _currentTrack)
            handleStationChanges(station.title, exampleRecs.tracks, _currentTrack)
            let ts = new Date().getTime()
            setTimestamp(ts) // this function runs the first time a station is switched to, so set a timestamp for when the currenTrack starts
            // handleStationListChanges(station.title, data.tracks)
            // if(currentTrack === null) {
            //     setCurrentTrack({
            //         track: exampleRecs.tracks[0],
            //         progress_ms: Math.floor(Math.random() * exampleRecs.tracks[0].duration_ms)
            //     })
            // }
        } else {
            // setTrackList(exampleRecs2.tracks)
            const _currentTrack = {
                track: exampleRecs2.tracks[0],
                progress_ms: Math.floor(Math.random() * exampleRecs2.tracks[0].duration_ms)
            }
            setCurrentTrack(_currentTrack)
            // handleStationListChanges(station.title, exampleRecs2.tracks, _currentTrack)
            handleStationChanges(station.title, exampleRecs2.tracks, _currentTrack)
            let ts = new Date().getTime()
            setTimestamp(ts) // this function runs the first time a station is switched to, so set a timestamp for when the currenTrack starts
            // handleStationListChanges(station.title, data.tracks)
            // if(currentTrack === null) {
            //     setCurrentTrack({
            //         track: exampleRecs2.tracks[0],
            //         progress_ms: Math.floor(Math.random() * exampleRecs2.tracks[0].duration_ms)
            //     })
            // }
        }
        
        // if(currentTrack === null) {
        //     setCurrentTrack(exampleRecs.tracks[0])
        // } else {
        //     // there will be a currentTrack already in state
        //     // checkCurrentTrackTime()
        // }
    }

    useEffect(() => {
        if(station.current === true) {
            if(station.trackList.length === 0) {
                // getTrackList(station.title, station.seeds)
                mockGetTrackList()
            }
        }

        const timeStamp = new Date().getTime() // this will be used to check current track progress, and then set to the new timestamp
        if(currentTrack !== null && station.current === true) {
            let currentProg = currentTrack.progress_ms
            let timeElapsed = timeStamp - timestamp // time between old timestamp and current timestamp
            let timeLeft = currentTrack.track.duration_ms - (currentTrack.progress_ms + (timeElapsed))
            // console.log(currentTrack.track.name, timeElapsed, timeLeft)
            if(timeLeft < 0) {
    
                const track = station.trackList.find((track) => track.id === currentTrack.track.id)
                const indexOf = station.trackList.indexOf(track)
                console.log("Moving to next song", station.trackList[indexOf + 1].name, station.trackList[indexOf + 1].duration_ms)

                // update the tracklist and set current song to the next song
                let _currentTrack = {
                    track: station.trackList[indexOf + 1],
                    progress_ms: Math.floor(Math.random() * station.trackList[indexOf + 1].duration_ms)
                }

                let updatedTrackList = [...station.trackList]
                updatedTrackList = station.trackList.slice(indexOf + 1, station.trackList.length)
                // handleStationListChanges(station.title, updatedTrackList, _currentTrack)
                handleStationChanges(station.title, updatedTrackList, _currentTrack)
                setCurrentTrack(_currentTrack)
                const ts = new Date().getTime()
                setTimestamp(ts) // not setting this could be a way to just go through the list
            }
        } 

    }, [station.current])


    return(
        <div className="station">
            <button onClick={() => handleStationChange(station.title)} style={{'backgroundColor': 'green', 'padding': '1rem', 'borderRadius': '5px', 'fontSize': '1.5rem'}}>{station.title}</button>

            {station.trackList.length > 0 ? <p>Here be tracks</p> : <p>No track.</p>}
        </div>
    )
}

Station.propTypes = {
    station: PropTypes.shape({
        title: PropTypes.string.isRequired,
        trackList: PropTypes.arrayOf(PropTypes.shape({
            artists: PropTypes.arrayOf(PropTypes.shape({
                name: PropTypes.string.isRequired
            })),
            name: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            uri: PropTypes.string.isRequired,
        })),
        seeds: PropTypes.shape({
            genres: PropTypes.arrayOf(PropTypes.string).isRequired,
            artists: PropTypes.arrayOf(PropTypes.string).isRequired,
            tracks: PropTypes.arrayOf(PropTypes.string).isRequired,
        }),
        current: PropTypes.bool.isRequired,
    })
}

export default Station;

