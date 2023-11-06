import {useState, useEffect} from 'react';
import PropTypes from 'prop-types'


function CurrentStation({station}) { 

    function displaySkeleton() {
        return(
            <section>
                <p>Listening to {station.playing.track.name} on {station.title}</p>
            </section>
        )
    }
    useEffect(() => {
        console.log("STATION", station)
    }, [station.playing])

    return(
        <article className="current-station">
            {/* Station name */}

            {/* Text Trivia or something */}

            {/* Sonng Title/Artist and Album */}
            <section className="current-station__trivia">
                <p>Pull random stuff from wikipedia about current artist, or just some quotes</p>
            </section>

            <section className="current-station__track-details">
                <p>Listening to {station.playing.track.name} on {station.title}</p>
                {/* {station.playing.album.images ? 
                    <img src={station.playing.track.album.images[1].url} alt={station.playing.track.name} />
                :<p>No image</p>
                } */}

            </section>
        </article>
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