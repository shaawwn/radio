import {useState, useEffect, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons'

import Station from './Station';

function Carousel({stations, accessToken, handleStationChange, handleStationChanges, timestampRef, toSync, webplayerTimestamp, screenWidth}) {
    // console.log("Loading carousel")

    const [stationIndices, setStationIndices] = useState()
    const toDisplay = useRef([]) // list of stations to be displayed in carousel at a given time
    const carouselRef = useRef()
    const touchstartRef = useRef()
    const touchEndRef = useRef()
    const moveRef = useRef()

    function scrollLeft() {
        console.log("scrolling left")
        let shifted = []

        const min = 0
        if(_checkBoundaryLeft() === false) {
            // console.log("Loop back over end of list")
            stationIndices.forEach(el => {
                if(el <= min) {
                    shifted.push(7)
                } else {
                    shifted.push(el - 1)
                }
            })
            // console.log("SHIFTED LEFT", shifted)
            setStationIndices(shifted)
        } else {
            stationIndices.forEach(el => {
                shifted.push(el - 1)
            })
            setStationIndices(shifted)
        }
    }

    function scrollRight() {
        // console.log("Scrolling right")
        let shifted = []
        if(_checkBoundaryRight() === false) {
            const max = stations.length - 1
            stationIndices.forEach(el => {
                if(el >= max) {
                    shifted.push(0)
                    // console.log("max reached", el, max, shifted)
                } else {
                    // console.log('not max', el, max, shifted)
                    shifted.push(el + 1)
                }
            })
            setStationIndices(shifted)
        } else {
            stationIndices.forEach(el => {
                shifted.push(el + 1)
            })
            console.log("Scrolling right", shifted)
            setStationIndices(shifted)
        }
    }


    function _checkBoundaryLeft() {
        if(stationIndices.includes(0)) {
            return false
        }
    }

    function _checkBoundaryRight() {
        // if(stationIndices[4] === stations.length - 1) {
        //     return false
        // }

        if(stationIndices.includes(stations.length -1)) {
            return false
        }
        // console.log(stationIndices, stations.length - 1)
    }

    function displayStations() {

        let max = stations.length - 1

        // console.log("STATIONS MAX", max, stationIndices)
        // so when it gets to 7 it adds + 1 which gives 8 which causes render error, so on 7 alone, do not increment + 1

        toDisplay.current

        toDisplay.current = []
        stationIndices.forEach(index => {
            toDisplay.current.push(stations[index])
        })
        // how to render [4, 5, 6, 7, 0] ? o here is stations[0]
        return(
            <>
            {/* const wrappedIndices = stationIndices.map(index => (index + stations.length) % stations.length); */}

                {toDisplay.current.map((station) => {
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
        )
    }


    useEffect(() => {
        if(stations) {
            if(screenWidth < 431) {
                setStationIndices([0, 1, 2])
            } else {
                setStationIndices([0, 1, 2, 3, 4, 5, 6, 7]) // set wider for more stations, this just to test
            }
        }
    }, [screenWidth])


    useEffect(() => {
        
        if(moveRef.current !== null) {
            moveRef.current = null
        }
        const handleStart = (e) => {
            e.preventDefault()
            moveRef.current = Math.round(e.touches[0].clientX)
        }

        const handleMove = (e) => {
            e.preventDefault()
            if(moveRef.current) {
                // check left or right
                if(e.touches[0].clientX < moveRef.current - 100) {
                    scrollRight()
                } else if (e.touches[0].clientX > moveRef.current + 100) {
                    scrollLeft()
                }
            }  
            // removed else here to set moveRef, moved to touchStart
        }

        const handleEnd = (e) => {
            // e.preventDefault() this will allow the click to go through?
            moveRef.current = null
        }

        // if(stationIndices) {
        //     carouselRef.current.addEventListener('touchstart', handleStart)
        //     carouselRef.current.addEventListener('touchmove', handleMove)
        //     carouselRef.current.addEventListener('touchend', handleEnd)

        //     return () => {
        //         carouselRef.current.removeEventListener('touchmove', handleMove)
        //         carouselRef.current.removeEventListener('touchstart', handleStart)
        //         carouselRef.current.removeEventListener('touchend', handleEnd)
        //     }
        // }
    }, [stationIndices])

    return(
        <div className="carousel flex-row flex-gap-small" ref={carouselRef}>
            <div className="center-horizontal">
                <FontAwesomeIcon icon={faChevronLeft} size={screenWidth < 431 ? '2x' : '3x'} className="center-horizontal" onClick={scrollLeft}/>
            </div>
            {stationIndices ? 
                <>
                    {displayStations()}
                </>
        
            :null}
            <div className="center-horizontal">
                <FontAwesomeIcon icon={faChevronRight} size={screenWidth < 431 ? '2x' : '3x'} className="center-horizontal" onClick={scrollRight}/>
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