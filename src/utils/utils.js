
function generateStation(accessToken, name, seeds, getRecommendations, initStation) {

    const setter = (returnVal) => {
        //
        initStation.current = returnVal
        // console.log("INIT STATION", initStation.current)
    }
    getRecommendations(accessToken, seeds, setter)

    fetch(`https://api.spotify.com/v1/recommendations?seed_genres=${seeds.genres}&seed_artists=${seeds.artists}&seed_tracks=${seeds.tracks}
    `, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(res => res.json())
    .then((data) => {
        // console.log("RECOMMENDATIONS", data)
        // setter(data)
        initStation.current = data
    })
}

export {
    generateStation
}