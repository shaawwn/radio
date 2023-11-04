import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import exampleRecs from '../rec_example.json';
import exampleRecs2 from '../rec_example.json';


function Station({accessToken, setStations, handleStationChange, station, handleStationListChanges}) {
    // console.log("Loading", station.title, station.trackList.length)
    // const [trackList, setTrackList] = useState([])
    const [timeStamp, setTimeStamp] = useState() // check against timestamps to measure time passed
    const [currentTrack, setCurrentTrack] = useState(null) // set a currentSong for the station that can be used to compare against timestamp


    function getTrackList() {
        // fetch
        fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${station.seeds.genres}&seed_artists=${station.seeds.artists}&seed_tracks=${station.seeds.tracks}
        `, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => res.json())
        .then((data) => {
            // console.log("RECOMMENDATIONS from Station", data, station.title)
            handleStationListChanges(station.title, data.tracks)
        })
        // MOCK


        // console.log("GETTING TRACKS FOR: ", title)
        // if(station.title === 'vgm') {
        //     // setTrackList(exampleRecs.tracks)
        //     handleStationListChanges(station.title, exampleRecs.tracks)
        // } else {
        //     // setTrackList(exampleRecs2.tracks)
        //     handleStationListChanges(station.title, exampleRecs2.tracks)
        // }
        
        if(currentTrack === null) {
            setCurrentTrack(exampleRecs.tracks[0])
        } else {
            checkCurrentTrackTime()
        }
    }

    function checkCurrentTrackTime() {
        // console.log("CURRENT TRACK", currentTrack)
    }

    useEffect(() => {

        if(accessToken && station) {
            if(station.current === true) {
                console.log("GETTING TRACKS")
                getTrackList(station.title, station.seeds)
            }
        }
    }, [accessToken])


    useEffect(() => {
        // console.log("Changing current station to: ", station.title)
        if(station.current === true) {
            if(station.trackList.length < 20) {
                getTrackList(station.title, station.seeds)
            }
            // console.log("Changing current station to: ", station.title)
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