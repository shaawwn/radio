
function getUser(accessToken, setter) {
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(res => res.json())
    .then((data) => {
        // console.log('USER DATA', data)
        setter(data)
    })
}

function getUserTopArtists(accessToken, setter) {
    fetch('https://api.spotify.com/v1/me/top/artists', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(res => res.json())
    .then((data) => {
        // console.log("TOP ARTISTS", data)
        setter(data)
    })
}

function getUserTopTracks(accessToken, setter) {
    fetch('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(res => res.json())
    .then((data) => {
        // console.log("TOP TRACKS", data)
        setter(data)
    })
}

function getRecommendations(accessToken, seeds, setter) {
    // seeds is object {'genres': [], 'artists': [], 'tracks': []}
    fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${seeds.genres}&seed_artists=${seeds.artists}&seed_tracks=${seeds.tracks}
    `, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(res => res.json())
    .then((data) => {
        console.log("RECOMMENDATIONS", data)
        setter(data)
    })
}

function getDeviceId() {
    //
}

function getCurrentlyPlaying(accessToken) {
    fetch(`https://api.spotify.com/v1/me/currently-playing`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then((response) => response.json())
    .then((data) => {
        console.log("CURRENT TO UPDATE", data)
    })
}
export {
    getUser,
    getUserTopArtists,
    getUserTopTracks,
    getRecommendations,
    getDeviceId,
    getCurrentlyPlaying
}