
function generateStation(accessToken, name, seeds, getRecommendations, setStations) {

    // fetch recommendations
    getRecommendations(accessToken, seeds, setStations)
}

export {
    generateStation
}