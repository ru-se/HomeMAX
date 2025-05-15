// ほめマックスの返事
import React from 'react'

const HomemaxMessageBubble = ({ message }) => {
  return (
    <div className='w-48 h-48 border-2 border-solid'>
      <div>
        <p>{ message }</p>
      </div>
    </div>
  )
}

export default HomemaxMessageBubble