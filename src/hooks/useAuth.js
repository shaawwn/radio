import {useState, useEffect, useRef} from 'react';

function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()
    
    const codeRef = useRef()

    useEffect(() => {

        if(codeRef.current) {
            return accessToken
        } else {
            codeRef.current = code
        }

        // console.log("BEFORE FETCH", code)
        fetch('https://wispy-bird-2586.fly.dev/radio/login', {
        // fetch('https://wispy-bird-2586.fly.dev/radio/devlogin', {
        // fetch('http://localhost:3000/radio/devlogin', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code:code
            })
        }).then((response) => response.json())
        .then((data) => {
            // console.log("DATA", data.refreshToken)
            setAccessToken(data.accessToken)
            setRefreshToken(data.refreshToken)
            setExpiresIn(data.expiresIn)
            window.history.pushState({}, null, '/radio')

        })
        .catch((err) => {
            window.location = '/'
            console.log("ERR in useAuth", err)
        })
    }, [code])

    useEffect(() => {
        if(!refreshToken || !expiresIn) return
        const interval = setInterval(() => {
            fetch('https://wispy-bird-2586.fly.dev/radio/refresh', {
            // fetch('http://localhost:3000/radio/refresh', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            }).then((response) => response.json())
            .then((data) => {
                console.log("REFRESHED TOKEN", data.accessToken)
                setAccessToken(data.accessToken)
                setExpiresIn(data.expiresIn)
                window.history.pushState({}, null, '/')
                //
            })
            .catch((err) => {
                window.location = '/'
            })
        // }, (expiresIn - 60) * 1000) // set to refresh accessToken in 59 minutes
    }   , 10000)
        if(!refreshToken || !expiresIn) return

        return () => clearInterval(interval)
    }, [refreshToken, expiresIn])

    return accessToken
}

export default useAuth;
