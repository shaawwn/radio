import {useState, useEffect, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeOff, faVolumeLow, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons'

/**
 * 
 * Default volume on load is 0.8 (out of 1), so there are 6 volume ranges: 
 *      0 (mute)
 *      1-3 (med)
 *      4-5 (high)
 * 
 *      These correspond to the 0-1 scale for colume, where doubling the vol level will set the volume (vol 2 * 2 = .4 volume)
 * 
 *      
 */
function Volume({accessToken, deviceId}) {

    // volume on a scale 0-6 (0, 20, 40, 60, 80, 100)
    const [volume, setVolume] = useState(6)
    const [active, setActive] = useState('volume__level__block--active')
    const [dummyVolume, setDummyVolume] = useState(6)
    const [inactive, setInactive] = useState('')
    
    const volRef = useRef(8)
    
    function increaseVolume() {
        fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=&device_id=${deviceId}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }).then((response) => {
            if(!response.ok) {
                throw new Error("There was a problem increasing volume")
            }
        }).then(() => {
            //
        }).catch((err) => {
            console.log("ERROR: ", err)
        })
    }

    function adjustVolume(newVolume) {
        const percentage = newVolume * 10
        fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${percentage}&device_id=${deviceId}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }).then((response) => {
            if(!response.ok) {
                throw new Error("There was a problem decreasing volume")
            }
        }).then(() => {
            //
            // console.log("Setting volume to: ", newVolume)
            setVolume(newVolume)
            setDummyVolume(newVolume)
        }).catch((err) => {
            console.log("ERROR: ", err)
        })
    }

    function showVolumeOnHover() {
        // whena  use hovers over a volume bar, show the volume that would be set if they clicked on that bar (ex if volume is a .8, and user hovers over .2, show only the .2 bar as active)

        // overwrite the volume html with a temp state?

    }

    function handleMouseLeave() {
        setDummyVolume(volume)
    }
    function displayVolume() {
        // use the volume state to determine what number of volumn blocks should return active
        // one block == 20% volume, 0 all blocks inactive, 1 all blocks active

        return(
            <div className="volume__level" onMouseLeave={handleMouseLeave}>
                <MuteBtn 
                    volume={volume}
                    active={''} 
                    adjustVolume={adjustVolume}
                    level={0}
                    volRef={volRef}
                    setDummyVolume={setDummyVolume}
                    dummyVolume={dummyVolume}
                />
                {volume === 2 ? 
                    <VolumeBar 
                        volume={volume}
                        active={active} 
                        adjustVolume={adjustVolume} 
                        level={2}
                        volRef={volRef}
                        setDummyVolume={setDummyVolume}
                        dummyVolume={dummyVolume}
                    /> 
                    :<VolumeBar 
                        volume={volume}
                        active={''} 
                        adjustVolume={adjustVolume}
                        level={2}
                        volRef={volRef}
                        setDummyVolume={setDummyVolume}
                        dummyVolume={dummyVolume}
                        />
                }
                {volume >= 4 ? 
                    <VolumeBar 
                        volume={volume}
                        active={active} 
                        adjustVolume={adjustVolume} 
                        level={4}
                        volRef={volRef}
                        setDummyVolume={setDummyVolume}
                        dummyVolume={dummyVolume}
                    /> 
                    :<VolumeBar 
                        volume={volume}
                        active={''} 
                        adjustVolume={adjustVolume}
                        level={4}
                        volRef={volRef}
                        setDummyVolume={setDummyVolume}
                        dummyVolume={dummyVolume}
                        />
                }
                {volume >= 6 ? 
                    <VolumeBar 
                        volume={volume}
                        active={active} 
                        adjustVolume={adjustVolume} 
                        level={6}
                        volRef={volRef}
                        setDummyVolume={setDummyVolume}
                        dummyVolume={dummyVolume}
                    /> 
                    :<VolumeBar 
                        volume={volume}
                        active={''} 
                        adjustVolume={adjustVolume}
                        level={6}
                        volRef={volRef}
                        setDummyVolume={setDummyVolume}
                        dummyVolume={dummyVolume}
                        />
                }
                {volume >= 8 ? 
                    <VolumeBar 
                        volume={volume}
                        active={active} 
                        adjustVolume={adjustVolume} 
                        level={8}
                        volRef={volRef}
                        setDummyVolume={setDummyVolume}
                        dummyVolume={dummyVolume}
                    /> 
                    :<VolumeBar 
                        volume={volume}
                        active={''} 
                        adjustVolume={adjustVolume}
                        level={8}
                        volRef={volRef}
                        setDummyVolume={setDummyVolume}
                        dummyVolume={dummyVolume}
                        />
                }
                {volume === 10 ? 
                    <VolumeBar 
                        volume={volume}
                        active={active} 
                        adjustVolume={adjustVolume} 
                        level={10}
                        volRef={volRef}
                        setDummyVolume={setDummyVolume}
                        dummyVolume={dummyVolume}
                    /> 
                    :<VolumeBar 
                        volume={volume}
                        active={''} 
                        adjustVolume={adjustVolume}
                        level={10}
                        volRef={volRef}
                        setDummyVolume={setDummyVolume}
                        dummyVolume={dummyVolume}
                        />
                }
                {/* <MuteBtn 
                    volume={volume}
                    active={''} 
                    adjustVolume={adjustVolume}
                    level={0}
                    volRef={volRef}
                    setDummyVolume={setDummyVolume}
                    dummyVolume={dummyVolume}
                /> */}
            </div>
        )
    }
    return(
        <div className="volume">
            {displayVolume()}
            {/* <FontAwesomeIcon icon={faVolumeHigh} size="2x" className="volume__icon" name="vol-mute"/> */}
        </div>
    )
}

function MuteBtn({volume, active, adjustVolume, level, dummyVolume, setDummyVolume}) {

    function handleClick() {
        // console.log("muting")
        adjustVolume(level)
    }

    function handleHover() {
        // console.log('hover')
        setDummyVolume(level)
    }

    function displayVolumeIcon() {
        if(volume >= 6) {
            return(
                <div className="volume__icon__wrapper">
                    <FontAwesomeIcon 
                    icon={faVolumeHigh} 
                    size="2x" className="volume__icon" 
                    // name="vol-mute"
                    onClick={handleClick}
                    onMouseOver={handleHover}
                    color={active}
                    />
                </div>
            )
        } else if(volume >= 2) {
            return(
                <div className="volume__icon__wrapper">
                    <FontAwesomeIcon 
                    icon={faVolumeLow} 
                    size="2x" className="volume__icon" 
                    // name="vol-mute"
                    onClick={handleClick}
                    onMouseOver={handleHover}
                    color={active}
                    />
                </div>
            )
        } else if(volume === 0) {
            return(
                <div className="volume__icon__wrapper">
                    <FontAwesomeIcon 
                    icon={faVolumeXmark} 
                    size="2x" className="volume__icon" 
                    // name="vol-mute"
                    onClick={handleClick}
                    onMouseOver={handleHover}
                    color={active}
                    />
                </div>
            )
        }
    }

    useEffect(() => {

    }, [volume])

    return(
        <>
            {displayVolumeIcon()}
        </>
    )
}
function VolumeBar({volume, active, adjustVolume, level, dummyVolume, setDummyVolume}) {

    function handleHover() {
        setDummyVolume(level)
    }

    function handleClick() {
        adjustVolume(level)
    }

    useEffect(() => {
        // console.log('..')
    }, [dummyVolume])

    return(
        // <div className={`volume__level__block ${active}`} onMouseOver={handleHover}></div>
        <div className="volume__level__block__wrapper">
            {dummyVolume >= level ? 
                <div className={`volume__level__block ${active ? active : 'volume__level__block--active'}`} onClick={handleClick} onMouseOver={handleHover}></div>
                :<div className={`volume__level__block ${''}`} onClick={handleClick} onMouseOver={handleHover}></div>
                }
        </div>
    )
}
export default Volume;