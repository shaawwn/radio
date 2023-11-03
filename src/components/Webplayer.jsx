import {useState, useEffect, useRef} from 'react';

function Webplayer({accessToken}) {
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

    
    /**
     * 
     * DONT ACTUALLY CONNECT THE PLAYER FOR THE TIME BEING JUST LOAD IT WITH PROPS
     */
    // useEffect(() => {

    //     if(player.current) {
    //         // so the problem here is that player doesn't exist in react, but it still has a spotify isntance on the spotify servers
    //         disconnectPlayer()
    //     }
    //     const script = document.createElement("script");
    //     script.src = "https://sdk.scdn.co/spotify-player.js";
    //     script.async = true;

    //     document.body.appendChild(script);

    //     window.onSpotifyWebPlaybackSDKReady = () => {

    //         player.current = new window.Spotify.Player({
    //             name: 'Web Playback SDK',
    //             getOAuthToken: cb => { cb(accessToken); },
    //             volume: 1
    //         });

    //         // setPlayer(player);

    //         player.current.addListener('ready', ({ device_id }) => {
    //             console.log('Ready with Device ID', device_id);
    //             setDeviceId(device_id)
    //         });

    //         player.current.addListener('not_ready', ({ device_id }) => {
    //             console.log('Device ID has gone offline', device_id);
    //         });

    //         player.current.addListener('player_state_changed', ( state => {

    //             if (!state) {
    //                 return;
    //             }

    //             setPaused(state.paused);
            
    //             player.current.getCurrentState().then( state => { 
    //                 // (!state)? setActive(false) : setActive(true)
    //                 if(state === null) {
    //                     setActive(false)
    //                 } else if(state !== null) {
    //                     setActive(true)
    //                     setCurrentTrack(state.track_window.current_track)
    //                 }
    //             });
            
    //         }));
    //         player.current.connect();

    //     };

    //     return () => {
    //         if(player.current) {
    //             player.current.disconnect().then(() => console.log("Disconnected"))
    //         } else {
    //             console.log("There is no player instance.", player)
    //         }
    //     }    
    // }, []);

    return(
        <div className="webplayer">
            <p>Webplayer</p>
        </div>
    )
}

export default Webplayer