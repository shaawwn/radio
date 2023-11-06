import {useState, useEffect} from 'react';
import PropTypes from 'prop-types'


function CurrentStation({station}) { 

    useEffect(() => {
    }, [station.playing])

    return(
        <>
        <p style={{'fontSize': '3rem'}}>Listening to {station.playing.track.name} on {station.title}</p>
        </>
    )
}

CurrentStation.propTypes = {
    station: PropTypes.shape({
        title: PropTypes.string.isRequired,
        trackList:PropTypes.array.isRequired,
        seeds: PropTypes.shape({
            genres: PropTypes.array,
            artists: PropTypes.array,
            track: PropTypes.array
        }),
        current: PropTypes.bool.isRequired,
        playing: PropTypes.shape({
            track: PropTypes.shape({
                name: PropTypes.string,
                progress_ms: PropTypes.number,
            })
        })
    })
}


export default CurrentStation