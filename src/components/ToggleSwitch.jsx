import {useState, useEffect} from 'react';

function ToggleSwitch({authUrl, accessToken}) {

    function turnOn() {
        setTimeout(() => {
            window.location.href=authUrl
        }, 150)
    }

    function turnOff() {

    }
    return(
        <>
            <label className="rocker rocker-small">
            <input type="checkbox"/>
            <span className="switch-left">O</span>
            <span className="switch-right">|</span>
            </label>
        </>
    )
}

export default ToggleSwitch;