import { useState } from 'react'
import React from "react";
import './EightBall.css'


const EightBall = ({ answers }) => {
  const [answer, setAnswer] = useState({msg: 'Think of a Question', color: 'black'})
  
  const getAnswer = () => {
    const idx = Math.floor(Math.random() * answers.length)
    setAnswer(answers[idx])
  }

  const reset = (evt) => {
    evt.stopPropagation()
    setAnswer({msg: 'Think of a Question', color: 'black'})
  }

  return (
    <div className="EightBall" style={{ backgroundColor: answer.color }} onClick={getAnswer}>
      <p className="EightBall-text">{answer.msg}</p>
      <button onClick={reset}>reset</button>
    </div>
  )
}

export default EightBall