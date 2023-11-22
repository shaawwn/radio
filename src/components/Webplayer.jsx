import {useState, useEffect, useRef} from 'react';
// import lyricsFinder from 'lyrics-finder'
import {getDeviceId} from '../utils/spotifyGetters'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRecordVinyl } from '@fortawesome/free-solid-svg-icons'


import Volume from './Volume';
import KRPG from '../images/krpg.png'
import KHRD from '../images/khrd.png'
import KRAP from '../images/krap.png'
import KJZZ from '../images/kjzz.png'
import KPNK from '../images/kpnk.png'
import KUNT from '../images/kunt.png'
import KPRG from '../images/kprg.png'
import WKHP from '../images/wkhp.png'

function Webplayer({accessToken, station, currentTrackRef, timestampRef, toSync}) {
    // console.log("WEBPLAYER", station.playing)
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [deviceId, setDeviceId] = useState()
    const [currentTrack, setCurrentTrack] = useState()
    const [logo, setLogo] = useState()

    const ct = useRef()
    const player = useRef(null)

    function displaySkeleton() {
        return(
            <section>
                <p>radioStatic</p>
            </section>
        )
    }

    function getStationLogo() {
        if(station.title === 'KRPG') {
            setLogo(KRPG)
        } else if(station.title === 'KHRD') {
            setLogo(KHRD)
        } else if(station.title === 'KRAP') {
            setLogo(KRAP)
        } else if(station.title === 'KJZZ') {
            setLogo(KJZZ)
        } else if(station.title === 'KPNK') {
            setLogo(KPNK)
        } else if(station.title === 'KUNT') {
            setLogo(KUNT)
        } else if(station.title === 'KPRG') {
            setLogo(KPRG)
        } else if(station.title === 'WKHP') {
            setLogo(WKHP)
        } else {
            setLogo()
        }
    }

    function _displayTrackDetails() {
        return(
            <section className="current-station__track-details">
            <p>Listening to {station.playing.track.name} on {station.title}</p>
            {station.playing ?  // triple check for album image
                <img className="current-station__track-details__image" src={station.playing.track.album.images[1].url} alt={station.playing.track.name} />
            :
            <div className="no-image">
                <img className="current-station__track-details__image" src="//:0" alt={station.playing.track.name} />
            </div>
            }

        </section>
        )
    }

    function displayTrackDetails() {
        return(
            <section className="current-station__track-details">
            {currentTrack ? 
                <>  
                    {currentTrack ?  // triple check for album image
                        <div className="flex-wrapper flex-wrapper--center">
                            <div className="current-station__track-details__image__wrapper">
                                <img className="current-station__track-details__image" src={currentTrack.album.images[0].url} alt={currentTrack.name} />
                                {logo ?  <img src={logo} className="current-station__track-details__logo"/> : null}
                            </div>
                        </div>
                    :<div className="flex-wrapper flex-wrapper--center">
                        <div className="current-station__track-details__image__wrapper">
                            <FontAwesomeIcon icon={faRecordVinyl} className="webplayer__skeleton__image" alt={currentTrack.track.name}/>
                            {logo ?  <img src={logo} className="current-station__track-details__logo"/> : null}
                        </div>
                    </div>
                    }
                    <div className="current-station__track-details__details">
                        <p className="current-station__track-details__details__track-name">{currentTrack.name}</p>
                        <p className="current-station__track-details__details__artist-name">{currentTrack.artists[0].name}</p>
                    </div>
                </>
            :<>
                <div className="flex-wrapper flex-wrapper--center">
                    <div className="current-station__track-details__image__wrapper">
                        <FontAwesomeIcon icon={faRecordVinyl} className="webplayer__skeleton__image" />
                        {logo ?  <img src={logo} className="current-station__track-details__logo"/> : null}
                    </div>
                </div>
                <div className="current-station__track-details__details">
                    <h1>Loading</h1>
                </div>
            </>
            }
        </section>
        )
    }


    function disconnectPlayer() {
        player.current.removeListener('ready', player._eventListeners.ready[0])
        player.current.removeListener('not_ready', player._eventListeners.not_ready[0])
        player.current.disconnect()
    }

    function getTrackUris(tracks) {
        let uris = []
        tracks.forEach((track) => {
            uris.push(track['uri'])
        })
        return uris
    }
    
    function startPlayback() {
        const uris = getTrackUris(station.trackList)
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                'uris': uris,
                'position_ms': station.playing.progress_ms
            })
        }).then((response) => {
            if(!response.ok) {
                alert("There was an error playing back track")
                throw new Error('error on playback start')
            }
        })
        .then(() => {
            // console.log("starting playback at ", station.playing.progress_ms)
            
        }).catch((err) => {
            console.log("Error:", err)
        })
    }


    useEffect(() => {
        if(player.current) {
            // so the problem here is that player doesn't exist in react, but it still has a spotify isntance on the spotify servers
            disconnectPlayer()
        }
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            player.current = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(accessToken); },
                volume: 0.6
            });

            // setPlayer(player);

            player.current.addListener('ready', ({ device_id }) => {
                // console.log('Ready with Device ID', device_id);
                setDeviceId(device_id)
            });

            player.current.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.current.addListener('player_state_changed', ( state => {
                if (!state) {
                    return;
                }

                setCurrentTrack(state.track_window.current_track);
                currentTrackRef.current.track = state.track_window.current_track
                currentTrackRef.current.progress_ms = 0
                timestampRef.current = new Date().getTime()
                // console.log("playback change", station.title, state.track_window.current_track.name) // when you change from webplayer, that station is not changing
                setPaused(state.paused);
                player.current.getCurrentState().then( state => { 
                    // (!state)? setActive(false) : setActive(true)
                    if(state === null) {
                        setActive(false)
                    } else if(state !== null) {
                        setActive(true) 
                    }
                });
            
            }));
            player.current.connect();
        };

        return () => {
            if(player.current) {
                player.current.disconnect().then(() => console.log("Disconnected"))
            } else {
                console.log("There is no player instance.", player)
            }
        }    
    }, []);

    useEffect(() => {
        // const timeLeft = station.playing.track.duration_ms - station.playing.progress_ms
        if(station && station.trackList.length > 0 && deviceId) {
            getStationLogo()
            if(currentTrack) {
                if(station.playing.track.name !== currentTrack.name) {
                    startPlayback()
                }
            }
            if(!currentTrackRef.current.track) {
                startPlayback()
            }
          }

    }, [deviceId, station])

    useEffect(() => {
        // when currentTrack changes, updated
        if(currentTrack) {
            // console.log("CURRENT", currentTrack.name)
            if(currentTrack.id !== station.playing.track.id) {
                if(currentTrack.name !== station.playing.track.name) {
                    toSync.current = true
                }
                // console.log("Set station from ", station.playing.track.name, " to ", currentTrack.name)
                // toSync.current = true
                // console.log(currentTrack.id, station.playing.id)
            }
        }
        
    }, [currentTrack])



    return(
        <article className="current-station">
            {station.playing.track.name === 'radioStatic' ? displaySkeleton() : displayTrackDetails()}
            {/* <Volume accessToken={accessToken} deviceId={deviceId}/> */}
        </article>
    )
}

function LyricsContainer({artist, track}) {

    useEffect(() => {
        if(artist && track) {
            (async function(artist, title) {
                let lyrics = await lyricsFinder(artist, title) || "Not Found!";
                console.log("LYRICS", lyrics);
            })(artist, track);
            fetch(`http://localhost:3000/radio/lyrics?artist=${artist}&&track=${track}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("lyrics", data)
            })
        }
    }, [artist])

    return(
        <section className="current-station__trivia">
            {/* <p>Pull random stuff from wikipedia about current artist, or just some quotes</p> */}
            {artist ? <p>{track} by{artist}</p> : <p>Pull random stuff from wikipedia about current artist, or just some quotes</p>}

        </section>
    )
}
export default Webplayer