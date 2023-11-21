import {useState, useEffect, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons'

import Station from './Station';

function Carousel({stations, accessToken, handleStationChange, handleStationChanges, timestampRef, toSync, webplayerTimestamp, screenWidth}) {
    console.log("Loading carousel")

    const [stationIndices, setStationIndices] = useState()
    const toDisplay = useRef([]) // list of stations to be displayed in carousel at a given time

    function scrollLeft() {
        console.log("Scrolling left...")
        let shifted = []

        if(_checkBoundaryLeft() === false) {
            console.log("Loop back over end of list")
        }
        stationIndices.forEach(el => {
            shifted.push(el - 1)
        })

        setStationIndices(shifted)
    }

    function scrollRight() {
        console.log("Scrolling right")
        let shifted = []
        
        if(_checkBoundaryRight() === false) {
            console.log("Loop to start of list")
        }
        stationIndices.forEach(el => {
            shifted.push(el + 1)
        })

        setStationIndices(shifted)
    }


    function _checkBoundaryLeft() {
        if(stationIndices[0] === 0) {
            return false
        }
    }

    function _checkBoundaryRight() {
        if(stationIndices[4] === stations.length - 1) {
            console.log(stationIndices[4], stations.length - 1, stationIndices[4] === stations.length - 1)
            return false
        }
    }
    useEffect(() => {
        if(stations) {
            // toDisplay.current = stations.slice(0, 5)

            // toDisplay.current = [0, 1, 2, 3, 4]
            // setStationIndices([0, 1, 2, 3, 4])
            if(screenWidth < 431) {
                setStationIndices([0, 1, 2, 3])
            } else {
                setStationIndices([0, 1, 2, 3, 4, 5, 6])
            }
        }
    }, [])


    return(
        <div className="carousel flex-row flex-gap-small">
            <div className="center-horizontal">
                <FontAwesomeIcon icon={faChevronLeft} size="3x" className="center-horizontal" onClick={scrollLeft}/>
            </div>
            {stationIndices ? 
                <>
                    {stations.slice(stationIndices[0], stationIndices[stationIndices.length - 1]).map((station) => {
                        return <Station 
                        key={station.title}
                        accessToken={accessToken}
                        handleStationChange={handleStationChange}
                        station={station}
                        handleStationChanges={handleStationChanges}
                        timestampRef={timestampRef}
                        toSync={toSync}
                        webplayerTimestamp={webplayerTimestamp}
                    />
                    })}
                </>
            :null}
            <div className="center-horizontal">
                <FontAwesomeIcon icon={faChevronRight} size="3x" className="center-horizontal" onClick={scrollRight}/>
            </div>
            
        </div>
    )
}

export default Carousel

/**
 * 
 * 
 * So the carousel holds stations as items, and as you scroll left or right loops around and shows stations.
 * 
 * There is a default state, that is stations 1-5 for example that show onload.
 * 
 * To the left and right the stations then loop around, from 1 moving left would be stations 5-1, and from 5 moving right would start stations 5-1 again
 * 
 * The default state acts as a kind of 'viewport' for the stations to display.  To the left and right are dynamic lists either in order or reversed depending on direction
 * 
 * Also potentially 2 types of scroll, arrow or swipe. Do arrow for now since it will work for both mobile and desktop.
 * 
 */