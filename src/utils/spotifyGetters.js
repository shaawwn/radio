
function getUser(accessToken, setter) {
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(res => res.json())
    .then((data) => {
        console.log('USER DATA', data)
        setter(data)
    })
}

export {
    getUser
}