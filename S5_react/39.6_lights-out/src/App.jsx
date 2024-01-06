import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Board from "./Board";
import './App.css'

/** Simple app that just shows the LightsOut game. */

const App = () => {
  return (
    <>      
      <div className="App">
        <Board nCols={5} nRows={5}/>
      </div>
    </>
  )
}

export default App
