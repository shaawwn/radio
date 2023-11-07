import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <App code={code}/>
  //</React.StrictMode>
)
