import {useState, useEffect, useRef} from 'react';

import radioStart from '../radiostart.mp3'
const turnOnSound = new Audio(radioStart)
function ToggleSwitch({authUrl, accessToken, radioOn}) {

    const [on, setOn] = useState(radioOn)

    function turnOn() {
        if(on === true) {
            return false
        }
        turnOnSound.play()
        setTimeout(() => {
            window.location.href=authUrl
        }, 300)
    }

    function turnOff() {
        console.log("Turning off")
        setOn(false)
        setTimeout(() => {
            window.location.href="https://shaawwn.github.io/radio/"
        }, 150)
    }



    return(
        <>
            <label className="rocker rocker-small">
            {/* <input type="checkbox"/> */}
            {on ? <input type="checkbox" onChange={turnOff} checked /> : <input type="checkbox"/>}
            <span className="switch-left" onClick={turnOn}>|</span>
            <span className="switch-right" onClick={turnOff}>O</span>
            </label>
        </>
    )
}

export default ToggleSwitch;