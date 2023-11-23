
import {useRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import ToggleSwitch from '../src/components/ToggleSwitch'

import KRPG from './images/krpg.png'
import KHRD from './images/khrd.png'
import KRAP from './images/krap.png'
import KJZZ from './images/kjzz.png'
import KPNK from './images/kpnk.png'
import KUNT from './images/kunt.png'
import KPRG from './images/kprg.png'
import gifDesc from './video/desc.gif'


function Login({authUrl}) {

    const [screenWidth, setScreenWidth] = useState()
    const divRef = useRef()

    function displayStations() {
        return(
        <article className="login__section">
        {/* <h2>Current Stations</h2> */}
        <section className="login__stations__station">
            <h3>KRPG</h3>
            <img src={KRPG} alt="krpg" className="login__stations__station__image"/>
            <p className="station-description">A mix of class and new video game music with an emphasis on SNES era RPGs</p>
        </section>
        <section className="login__stations__station">
            <h3>KHRD</h3>
            <p className="station-description">A mix of class and new video game music with an emphasis on SNES era RPGs</p>
            <img src={KHRD} alt="khrd" className="login__stations__station__image"/>

        </section>
        <section className="login__stations__station">
            <h3>KRAP</h3>
            <img src={KRAP} alt="krap" className="login__stations__station__image"/>
            <p className="station-description">A mix of class and new video game music with an emphasis on SNES era RPGs</p>
        </section>
        <section className="login__stations__station">
            <h3>KUNT</h3>
            <img src={KUNT} alt="kunt" className="login__stations__station__image"/>
            <p className="station-description">A mix of class and new video game music with an emphasis on SNES era RPGs</p>
        </section>
        <section className="login__stations__station">
            <h3>KPNK</h3>
            <p className="station-description">A mix of class and new video game music with an emphasis on SNES era RPGs</p>
            <img src={KPNK} alt="KPNK" className="login__stations__station__image"/>
        </section>
        <section className="login__stations__station">
                <h3>KJZZ</h3>
                <img src={KJZZ} alt="kjzz" className="login__stations__station__image"/>
                <p className="station-description">From timeless classics to contemporary grooves, experience the artistry of legendary musicians.</p>
            </section>
        <section className="login__stations__station">
            <h3>KPRG</h3>
            <img src={KPRG} alt="kprg" className="login__stations__station__image"/>
            <p className="station-description">A mix of class and new video game music with an emphasis on SNES era RPGs</p>
        </section>
    </article>)
    }

    function displayStationsMobile() {

        return(
            <article className={"login__section login__section login__stations__wrapper"}>
            <section className="login__stations__station">
                <h3>KRPG</h3>
                <img src={KRPG} alt="krpg" className="login__stations__station__image"/>
                <p className="station-description">A mix of class and new video game music with an emphasis on SNES era RPGs</p>
            </section>
            <section className="login__stations__station">
                <h3>KHRD</h3>
                <img src={KHRD} alt="khrd" className="login__stations__station__image"/>
                <p className="station-description">Raw riffs, relentless beats. Pure hard rock power.</p>
            </section>
            <section className="login__stations__station">
                <h3>KRAP</h3>
                <img src={KRAP} alt="krap" className="login__stations__station__image"/>
                <p className="station-description">Sick beats, tight rhymes. Unleash rap's raw energy.</p>
            </section>
            <section className="login__stations__station">
                <h3>KUNT</h3>
                <img src={KUNT} alt="kunt" className="login__stations__station__image"/>
                <p className="station-description">Saddle up for a journey through authentic stories and twangy tunes.</p>
            </section>
            <section className="login__stations__station">
                <h3>KPNK</h3>
                <img src={KPNK} alt="KPNK" className="login__stations__station__image"/>
                <p className="station-description"> Brace yourself for anarchy and relentless sonic rebellion</p>
            </section>
            <section className="login__stations__station">
                <h3>KJZZ</h3>
                <img src={KJZZ} alt="kjzz" className="login__stations__station__image"/>
                <p className="station-description">From timeless classics to contemporary grooves, experience the artistry of legendary musicians.</p>
            </section>
            <section className="login__stations__station">
                <h3>KPRG</h3>
                <img src={KPRG} alt="kprg" className="login__stations__station__image"/>
                <p className="station-description">Embark on a musical odyssey through the intricate realms of progressive rock.</p>
            </section>
        </article>
        )
    }

    function handleClick() {
        console.log("Clicked")
    }

    useEffect(() => {

        if(!screenWidth) {
            let screenSize = window.innerWidth
            setScreenWidth(screenSize)
            window.addEventListener('resize', () => {
                screenSize = window.innerWidth
                setScreenWidth(screenSize)
            })
        }

        const handleTouch = (e) => {
            // e.preventDefault()
            console.log("Touchend")
        }
        
    }, [])


    return(
        <>
            <header className="dashboard-header">

            </header>
            <main className="login">
                <section className="login__section">
                    <p className="font-title">Online Radio with Spotify</p>
                    <a href={authUrl} className="login__btn">Start Listening</a>
                </section>


            </main>

            <footer>

            </footer>
        </>
    )
}

Login.propTypes = {
    authUrl: PropTypes.string.isRequired,
}
export default Login;