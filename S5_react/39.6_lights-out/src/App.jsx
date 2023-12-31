import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Board from "./Board";
import './App.css'

/** Simple app that just shows the LightsOut game. */

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <>      
      <div className="App">
        <Board />
      </div>
    </>
  )
}

export default App
