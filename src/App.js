import React, { useState, useEffect }  from 'react';
import './App.css';

import NewDiv from './components/newdiv'
import Camera from './components/Camera'

function App() {


  const [window, setWindow] = useState("WIN");
  useEffect(() => localStorage.setItem('windowUSEEFECT', window), [
    window
  ]);

  function handleChangeWin(event) { 
      setWindow(() => {
        localStorage.setItem('winstorag',event)
        return event
      }
    )
  }


  
  return (
    <div>
      {/* <NewDiv sendOver={window} handleChangeWin={handleChangeWin}/> */}
      <Camera />
    </div>
  )
}

export default App;
