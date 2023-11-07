import {useState, useEffect, useRef} from 'react';
import {getDeviceId} from '../utils/spotifyGetters'


function Webplayer({accessToken, station}) {
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [deviceId, setDeviceId] = useState()
    const [currenTrack, setCurrentTrack] = useState()

    const player = useRef(null)

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
        // console.log("RSTARTING PLAYBACK AT: ", station.playing.progress_ms)
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
            console.log("starting playback at ", station.playing.progress_ms)
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

                setPaused(state.paused);
            
                player.current.getCurrentState().then( state => { 
                    // (!state)? setActive(false) : setActive(true)
                    if(state === null) {
                        setActive(false)
                    } else if(state !== null) {
                        setActive(true)
                        setCurrentTrack(state.track_window.current_track)
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
        // console.log("STATION", station.title, station.playing, station.playing.progress_ms)
        const timeLeft = station.playing.track.duration_ms - station.playing.progress_ms
        // console.log("IN WEBPLAYER", station.playing.track.name,  "progress", station.playing.progress_ms, "timeleft", timeLeft)
        if(station && station.trackList.length > 0 && deviceId) {
            startPlayback()
        }

    }, [deviceId, station])



    return(
        <div className="webplayer">
            <p>Webplayer</p>
            {station ? <p>{station.title} loaded in webplayer</p> : <p>Empty webplayer</p>}
            {/* {deviceId? <p>Device id set: {deviceId}</p> :<p>device not set</p>} */}
        </div>
    )
}

export default Webplayer