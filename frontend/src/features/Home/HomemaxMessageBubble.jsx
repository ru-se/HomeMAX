import React from 'react'

const HomemaxMessageBubble = ({ message }) => {
  return (
    <div className='h-full flex items-center'>
      <div
        className='
          min-w-64 min-h-24 max-w-md max-h-96 border-2 border-solid relative px-12 py-8 text-base font-normal border-black rounded-4xl bg-pink
          before:absolute before:top-1/2 before:right-0 before:translate-x-full before:-translate-y-1/2
          before:border-y-[10px] before:border-l-[20px] before:border-y-transparent before:border-l-black
          after:absolute after:top-1/2 after:right-0 after:translate-x-full after:-translate-y-1/2
          after:border-y-[7.8px] after:border-l-[15.5px] after:border-y-transparent after:border-l-pink shadow-xl
          flex items-center justify-center'
      >
        <div className='w-auto max-h-60 overflow-y-auto'>
          {message || '褒め言葉を考えてるよ！！'}
        </div>
      </div>
    </div>
  )
}

export default HomemaxMessageBubble