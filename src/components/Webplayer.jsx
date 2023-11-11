import {useState, useEffect, useRef} from 'react';
import {getDeviceId} from '../utils/spotifyGetters'


function Webplayer({accessToken, station, currentTrackRef, timestampRef, toSync}) {
    // console.log("WEBPLAYER", station.playing)
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [deviceId, setDeviceId] = useState()
    const [currentTrack, setCurrentTrack] = useState()

    const ct = useRef()
    const player = useRef(null)

    function displaySkeleton() {
        return(
            <section>
                <p>radioStatic</p>
            </section>
        )
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
                    <div className="current-station__track-details__details">
                        <p>{currentTrack.name}</p>
                        <p style={{"fontSize": "1.75rem"}}>{currentTrack.artists[0].name}</p>
                    </div>
                    {/* <p>{currentTrack.name} {currentTrack.artists[0].name} on {station.title}</p> */}
                    {currentTrack ?  // triple check for album image
                        <div className="flex-wrapper flex-wrapper--center">
                            <img className="current-station__track-details__image" src={currentTrack.album.images[0].url} alt={currentTrack.name} />
                        </div>
                    :
                    <div className="no-image">
                        <img className="current-station__track-details__image" src="//:0" alt={currentTrack.track.name} />
                    </div>
                    }
                </>
            :null
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
                volume: 1
            });

            // setPlayer(player);

            player.current.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
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
            {/* Station name */}

            {/* Text Trivia or something */}

            {/* Sonng Title/Artist and Album */}
            <section className="current-station__trivia">
                <p>Pull random stuff from wikipedia about current artist, or just some quotes</p>
            </section>

            {/* {displayTrackDetails()} */}
            {station.playing.track.name === 'radioStatic' ? displaySkeleton() : displayTrackDetails()}
        </article>
    )
}

export default Webplayer