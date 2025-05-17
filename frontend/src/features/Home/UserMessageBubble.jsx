// ユーザーの送信したメッセージの吹き出し

import React from 'react'

const UserMessageBubble = ({ message }) => {
  return (
    <div className='mt-10 mr-20 flex-col-reverse '>
      <div className='
        relative w-90 h-85  px-4 py-2 text-base border-2  bg-pink shadow-xl rounded-full
      '>
        <div className='mt-12  w-64 mx-auto max-h-56 overflow-y-auto items-center text-center'>
          {message}
        </div>
      </div>
      <div className="ml-10 w-20 h-20  px-4 py-2 text-base border-2  bg-pink shadow-xl rounded-full"></div>
      <div className="w-10 h-10  px-4 py-2 text-base border-2  bg-pink shadow-xl rounded-full"></div>
    </div>
  )
}

export default UserMessageBubble