// ほめマックスの返事
import React from 'react'

const HomemaxMessageBubble = ({ message }) => {
  return (
    // <div className='w-48 h-48 border-2 border-solid'>
    //   <div>
    //     <p>{message || '生成中...'}</p>
    //   </div>
    // </div>
    <div className='h-full'>
      <div
        className='
           w-90 h-120 max-h-9/10  border-2 border-solid relative  px-4 py-2 text-base font-normal  border-black rounded-4xl bg-pink
          before:absolute before:top-1/2 before:right-0 before:translate-x-full before:-translate-y-1/2
          before:border-y-[10px] before:border-l-[20px] before:border-y-transparent before:border-l-black
          after:absolute after:top-1/2 after:right-0 after:translate-x-full after:-translate-y-1/2
          after:border-y-[7.8px] after:border-l-[15.5px] after:border-y-transparent after:border-l-pink shadow-xl
        '>
          <div className='w-auto max-h-full overflow-y-auto'>
            { message || '生成中...'}
          </div>
      </div>
    </div>
  )
}

export default HomemaxMessageBubble