import React,  { useState, useEffect } from 'react'

function Newdiv(props){

    const [greeting, setGreeting] = useState(
        localStorage.getItem('myValueInLocalStorage') || '',
      );

    const handleChangeM = event => setGreeting(
        () => {
            executeFunction(event);
            return event;
          }
        );

    useEffect(
        () => {
            setGreeting(currentCount => currentCount + "888")
           },
        [],
        );
  
    function executeFunction(event) {
        localStorage.setItem('myValueInLocalStorage',event)
    }


    
    


    return (
        <div>
          <h1>{greeting}</h1>
          <input
            type="text"
            value={greeting}
            onChange={event => handleChangeM(event.target.value)}
          />
          <input value={props.sendOver} onChange={event => props.handleChangeWin(event.target.value)}/>
        </div>
    )

}

export default Newdiv;