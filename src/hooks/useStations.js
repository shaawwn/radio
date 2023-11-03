import {useState, useEffect, useRef} from 'react';

import {getUserTopTracks, getUserTopArtists, getRecommendations} from '../utils/spotifyGetters'
import {generateStation} from '../utils/utils'
import exampleRecs from '../rec_example.json';
import exampleRecs2 from '../rec_example.json';

/**
 * 
 * Set the currently playing song here, because I don't want to be re-rendering everytime a song changes
 * 
 * Track two things: 
 * 
 * The Currently Playing station and song
 * 
 * the other stations with their current songs (that are not currently playing)
 * 
 * station object: {
 *  name: 'Rock Station',
 *  current: {name/id: "Free", progress_ms: 132010},
 *  songs: [<array of song objects>] // this is the playlist that is generated
 * }
 * 
 * currentStation?
 * current StationObject = {
 *  name: 'Punk Station',
 *  currentlyPlayng: {name/id: "Kill the poor", progress_ms: 230120}.
 *  songs: [Array pf song objects]
 * }
 * 
 * When changing station, get ^ that songs progess_ms and store it and begin incrementing that value once per second
 * 
 * After the station 'swtiches', use that progress_ms and check it against the new stations 'current' song, if it < the duration, start playing at progress_ms or duration - progress_ms (so that all songs dont just start playing at 45 seconds in or something)
 * 
 * If it is > than the 'current', go to the next song and apply the difference to the progress of the new song
 * 
 * Each time a station is switched, check the progress against whatever the current song progress is
 * 
 * Essentially, I want a rolling value for progress that songs can be checked against to give the illusion of the radio playing in the background even if the station is not selected.
 * 
 * There still needs to be some check/safeguard that keeps the other stations dynamic, using JUST the above method, it means that if you are listening to a station for 1 hour, and switch it might STILL be the song that was playing as you checked other stations (that is, 40000ms for progress with usually be less than the time for a song like freebird, so it could seem like freebird is just always on the station)
 * I want songs to persist but not in that static kind of way 
 * 
 */
const DEFAULT_STATIONS = {
    bespoke: {
        title: "Bespoke",
        trackList: [],
        seeds:  {'genres': [], artists: [
            '6dOnTTVTbQlFWF6yfD4Vw5',
            '7cGkvEcOOYVtNdfkf3s1tK',
            '63JXuvboeORZFlNVoivVLT',
            '0oSGxfWSnnOXhD2fKuz2Gy'], tracks: []
    }},
    // rock: {
    //     title: "Rock",
    //     seeds:  {'genres': [], artists: [
    //         '6dOnTTVTbQlFWF6yfD4Vw5',
    //         '7cGkvEcOOYVtNdfkf3s1tK',
    //         '63JXuvboeORZFlNVoivVLT',
    //         '0oSGxfWSnnOXhD2fKuz2Gy'], tracks: [],}
    // }
}

function fetchExample() {
    return exampleRecs
}



function useStations(accessToken) {

    let stationTemplate = {
        name: '',
        seeds: {
            genres: [],
            artists: [],
            tracks: []
        }, 
        trackList: []
    }
    const [topTracks, setTopTracks] = useState()
    const [topArtists, setTopArtists] = useState()
    const [currentlyPlaying, setCurrentlyPlaying] = useState()
    const [stations, setStations] = useState([])

    // stations
    const [station1, setStation1] = useState(stationTemplate)
    const [station2, setStation2] = useState(stationTemplate)

    // const currentlyPlayingProgress = useRef(currentlyPlaying.progress_ms)

    function getStationTrackList(station) {
        fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${station.seeds.genres}&seed_artists=${station.seeds.artists}&seed_tracks=${station.seeds.tracks}
        `, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => res.json())
        .then((data) => {
            // console.log("RECOMMENDATIONS", data)
            setStations((prevStations) => {
                return {
                    ...prevStations,
                    [station.title]: {
                        ...prevStations[station.title],
                        trackList: data.tracks
                    }
                }
            })
        })
    }
    
    function generateStation(title, setStation, station, recs) {
        // fetch(`https://api.spotify.com/v1/recommendations?genre_seeds=${seeds.genre}&artists=${seeds.artist}&tracks=${seeds.tracks}`, {
        //     headers: {
        //         'Authorization': `Bearer ${accessToken}`
        //     }
        // }).then(response => response.json())
        // .then((data) => {
        //     console.log(`Recommendations for ${title}`, data)
        // })
        let stationObject = {
            name: title,
            seeds: recs.seeds,
            trackList: recs.tracks
        }
        setStation(stationObject)
        
        let stationCopy = [...stations]
        console.log("BEFORE", stationCopy)
        stationCopy.push(stationObject)
        console.log("AFTER", stationCopy)
        setStations(stationCopy)
    }

    function generateStations() {
        generateStation('vgm', setStation1, station1, exampleRecs)   
        generateStation('rock', setStation2, station2, exampleRecs2)
    }

    useEffect(() => {
        if(accessToken) {
            getUserTopTracks(accessToken, setTopTracks)
            getUserTopArtists(accessToken, setTopArtists)
            generateStations()
        }

    }, [accessToken])

    // useEffect(() => {
    //     if(topTracks && topArtists) {
    //         // console.log("Generating playlists here", topTracks, topArtists)
    //         // console.log("STATIONS", stations, station1, station2)
    //     }
    // }, [topTracks, topArtists])

    console.log("STATIONS RETURN", stations)
    return [stations]
}


// const station = {
//     name: "",
//     current: "<spotify track object>",
//     currentProgress: '<int value for progress of song>',
//     current: {
//         track: '<either the name or the track object itself>',
//         progress_ms: 'progress of song as determined by the random generation'
//     }
//     trackList: "<Array of spotify tracks generated from recommendations>"
// }

// const currentlyPlaying = {
//     name: "<spotify track object> or name"
//     progress_ms: '<int value for progress of song',
//     duration_ms: '<int value for duration of song'
// }

const currentStations = '<station object that is set to current>'

export default useStations