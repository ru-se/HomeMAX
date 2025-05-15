// ほめマックスの返事
import React from 'react'

const HomemaxMessageBubble = ({ message }) => {
  return (
    <div className='h-full'>
      <div className='w-48 h-9/10 border-2 border-solid'>
        <p>{ message }</p>
      </div>
    </div>
  )
}

export default HomemaxMessageBubble