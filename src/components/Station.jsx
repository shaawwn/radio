import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import exampleRecs from '../rec_example.json';
import exampleRecs2 from '../rec_example2.json';
import punk from '../punk.json';
import rap from '../rap.json';

import KRPG from '../images/krpg.png'

function Station({accessToken, setStations, handleStationChange, station, setCurrentStation, handleStationChanges, timestampRef, webplayerTimestamp}) {
    const [timestamp, setTimestamp] = useState()
    const [logo, setLogo] = useState()

    function getStationLogo() {
        if(station.title === 'KRPG') {
            setLogo(KRPG)
        }
    }
    function mockGetTrackList() {
        // console.log("GETTING TRACKS", station.title)
        if(station.title === 'KRPG') {
            const _currentTrack = {
                track: exampleRecs.tracks[0],
                progress_ms: Math.floor(Math.random() * exampleRecs.tracks[0].duration_ms)
            }
            // setCurrentTrack(_currentTrack)
            handleStationChanges(station.title, exampleRecs.tracks, _currentTrack)
            let ts = new Date().getTime()
            setTimestamp(ts) // this function runs the first time a station is switched to, so set a timestamp for when the currenTrack starts
            // _printTimeDetails(_currentTrack, ts)
        } else if(station.title === 'KHRD') {
            const _currentTrack = {
                track: exampleRecs2.tracks[0],
                progress_ms: Math.floor(Math.random() * exampleRecs2.tracks[0].duration_ms)
            }
            // setCurrentTrack(_currentTrack)
            handleStationChanges(station.title, exampleRecs2.tracks, _currentTrack)
            let ts = new Date().getTime()
            setTimestamp(ts) // this function runs the first time a station is switched to, so set a timestamp for when the 
            // _printTimeDetails(_currentTrack, ts)
        } else if(station.title === 'KPNK') {
            const _currentTrack = {
                track: punk.tracks[0],
                progress_ms: Math.floor(Math.random() * punk.tracks[0].duration_ms)
            }
            // setCurrentTrack(_currentTrack)
            handleStationChanges(station.title, punk.tracks, _currentTrack)
            let ts = new Date().getTime()
            setTimestamp(ts) // this function runs the first time a station is switched to, so set a timestamp for when the 
            // _printTimeDetails(_currentTrack, ts)
        } else if(station.title === 'KRAP') {
            const _currentTrack = {
                track: rap.tracks[0],
                progress_ms: Math.floor(Math.random() * rap.tracks[0].duration_ms)
            }
            // setCurrentTrack(_currentTrack)
            handleStationChanges(station.title, rap.tracks, _currentTrack)
            let ts = new Date().getTime()
            setTimestamp(ts) // this function runs the first time a station is switched to, so set a timestamp for when the
            // _printTimeDetails(_currentTrack, ts) 
        }
    }

    function getTrackList() {
        // all initialization stuff when the station first loads
        fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${station.seeds.genres}&seed_artists=${station.seeds.artists}&seed_tracks=${station.seeds.tracks}
        `, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => res.json())
        .then((data) => {
            // console.log("RECOMMENDATIONS from Station", data.tracks, station)

            const _currentTrack = {
                track: data.tracks[0],
                progress_ms: Math.floor(Math.random() * data.tracks[0].duration_ms)
            }
            // setCurrentTrack(_currentTrack)
            handleStationChanges(station.title, data.tracks, _currentTrack)
            let ts = new Date().getTime()
            setTimestamp(ts) 
        })
    }

    function _printTimeDetails(currentTrack, ts) {
        // console.log("CURRENT", currentTrack)
        const currentTime = new Date().getTime()
        const timeElapsed = currentTime - ts;
        const timeLeft = currentTrack.track.duration_ms - (currentTrack.progress_ms + timeElapsed)
        console.log(currentTrack.track.name, "progress: ", currentTrack.progress_ms, "should be left: ", timeLeft)
    }

    function checkWebplayerTimestamp() {
        let found = webplayerTimestamp.current.find((webplayerStation) => webplayerStation.title === station.title)
        let index = webplayerTimestamp.current.indexOf(found)
        // console.log("INDEX", index)
        const currentTime = new Date().getTime()
        const timeElapsed = currentTime - found.timestamp;
        const timeLeft = station.playing.track.duration_ms - (station.playing.progress_ms + timeElapsed)
        // console.log("TIME ELAPSED FROM WEBPLAYER TIMESTAMP", timeElapsed)
        if(timeLeft < 0) {
            // change song
            const track = station.trackList.find((track) => track.id === station.playing.track.id)
            const index = station.trackList.indexOf(track);
            console.log("TIME LEFT WEBPLAYER", timeLeft, track.name)
            let _currentTrack = {
                track: station.trackList[index + 1],
                progress_ms: timeLeft * -1 // abs of time left
            }
            let updatedTrackList = [...station.trackList]
            updatedTrackList = station.trackList.slice(index + 1, station.trackList.length)
            handleStationChanges(station.title, updatedTrackList, _currentTrack)
            const ts = new Date().getTime()
            setTimestamp(ts) 
        } else {
            // just set a new timestamp but dont change the song
            const track = station.trackList.find((track) => track.id === station.playing.track.id)
            const index = station.trackList.indexOf(track);
            let _currentTrack = {
                track: station.trackList[index],
                progress_ms: station.playing.progress_ms + timeElapsed,
            }

            let updatedTrackList = [...station.trackList] // because the tracklist is going to be the same
            handleStationChanges(station.title, updatedTrackList, _currentTrack)
            const ts = new Date().getTime()
            setTimestamp(ts) 
        }

        webplayerTimestamp.current.splice(index, 1)
        // console.log("UPDATED WBTS", webplayerTimestamp.current)
    }


    function checkTimestamp() {
        // check the song timestamp against current UTC time to determing if the song would have ended
        const currentTime = new Date().getTime()
        const timeElapsed = currentTime - timestamp;
        // const timeLeft = currentTrack.track.duration_ms - (currentTrack.progress_ms + timeElapsed)
        const timeLeft = station.playing.track.duration_ms - (station.playing.progress_ms + timeElapsed)


        if(timeLeft < 0) {
            // change song

            const track = station.trackList.find((track) => track.id === station.playing.track.id)
            const index = station.trackList.indexOf(track);
            // console.log("TIME LEFT", timeLeft, track.name)
            let progress;
            if(timeLeft * -1 > station.trackList[index + 1].duration_ms) {
                const progress = Math.floor(Math.random() * station.trackList[0].duration_ms)
                console.log('setting progress', progress)
            }
            // console.log("prog", progress)
            let _currentTrack = {
                track: station.trackList[index + 1],
                progress_ms: progress!== undefined ? progress : timeLeft * -1 // abs of time left (if a REALLY long time has passed, this will set the next song to 0 I think)
            }
            let updatedTrackList = [...station.trackList]
            updatedTrackList = station.trackList.slice(index + 1, station.trackList.length)
            handleStationChanges(station.title, updatedTrackList, _currentTrack)
            const ts = new Date().getTime()
            setTimestamp(ts) 
        } else {
            // just set a new timestamp but dont change the song
            const track = station.trackList.find((track) => track.id === station.playing.track.id)
            const index = station.trackList.indexOf(track);
            // console.log("PLAYING", station.playing.track.name, station.playing.progress_ms, 'elapsed: ', timeElapsed)
            // its using the previous station timestamp since it isn't being set
            let _currentTrack = {
                track: station.trackList[index],
                progress_ms: station.playing.progress_ms + timeElapsed,
            }

            let updatedTrackList = [...station.trackList] // because the tracklist is going to be the same
            handleStationChanges(station.title, updatedTrackList, _currentTrack)
            const ts = new Date().getTime()
            // console.log("SETTING TIMESAMPE", ts)
            setTimestamp(ts) 
        }
    }

    useEffect(() => {
        if(station.current === true) {
            if(station.trackList.length === 0) {
                // mockGetTrackList()
                getTrackList()
            }
        }

        // const timeStamp = new Date().getTime() // this will be used to check current track progress, and then set to the new timestamp
        if(station.playing.track.name !== 'radioStatic' && station.current === true) {
            // if(webplayerTimestamp.current && (station.title === webplayerTimestamp.current.title)) { 
            //     // there is always going to be a timestamp, but the condition is that if the timestamp matches current station, then it signals that the song change has happened via webplayer not station change
       
            //     checkWebplayerTimestamp()
            if(webplayerTimestamp.current.length > 0) {
                let found = webplayerTimestamp.current.find((webplayerStation) => webplayerStation.title === station.title) 
                if(found) {
                    checkWebplayerTimestamp()
                } else {
                    checkTimestamp()
                }
            } else {
                checkTimestamp()
            }
        } 

        getStationLogo()
    }, [station.current])


    return(
        <div className="station">
            <button onClick={() => handleStationChange(station.title)} style={{'backgroundColor': 'green', 'padding': '1rem', 'borderRadius': '5px', 'fontSize': '1.5rem'}}>
                {/* {station.title} */}
            
                {/* <img src={logo} /> */}
                {logo ? <img className="image-logo" src={logo} /> : <p>{station.title}</p>}

            </button>

            {/* {station.trackList.length > 0 ? null: <p>No track.</p>} */}
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

