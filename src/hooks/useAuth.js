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
        fetch('http://localhost:3000/radio/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code:code
            })
        }).then((response) => response.json())
        .then((data) => {
            setAccessToken(data.accessToken)
            setRefreshToken(data.refreshToken)
            setExpiresIn(data.expiresIn)
            window.history.pushState({}, null, '/')

        })
        .catch((err) => {
            window.location = '/'
        })

    }, [code])

    useEffect(() => {
        if(!refreshToken || !expiresIn) return
        const interval = setInterval(() => {
            fetch('http://localhost:3000/radio/refrsh', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: refreshToken
                })
            }).then((response) => response.json())
            .then((data) => {
                setAccessToken(data.accessToken)
                setExpiresIn(data.expiresIn)
                window.history.pushState({}, null, '/')
                //
            })
            .catch((err) => {
                window.location = '/'
            })
        }, (expiresIn - 60) * 1000)
        if(!refreshToken || !expiresIn) return

        return () => clearInterval(interval)
    }, [refreshToken, expiresIn])

    return accessToken
}

export default useAuth;
