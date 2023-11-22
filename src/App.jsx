import { } from 'react'

import Dashboard from './Dashboard';
import Login from './Login'

const devUri = 'http://localhost:3001/radio/'
const uri = 'https://shaawwn.github.io/radio/'
const clientId = 'e1abd36e0dd14186bdf588b8e39acc1d'
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${uri}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20ugc-image-upload%20playlist-modify-private%20playlist-modify-public%20user-read-recently-played%20user-follow-read%20user-top-read`

// const code = new URLSearchParams(window.location.search).get('code')


function App({code}) {
  
  return code ? <Dashboard code={code} />: <Login authUrl={AUTH_URL}/>
  
}

export default App
