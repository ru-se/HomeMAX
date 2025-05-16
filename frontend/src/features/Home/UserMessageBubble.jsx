// ユーザーの送信したメッセージの吹き出し

import React from 'react'

const UserMessageBubble = ({ message }) => {
  return (
    <div className='flex flex-col-reverse '>
      <div className='
        relative w-48 h-40 px-4 py-2 text-base border-2 rounded-4xl bg-pink before:absolute before:top-full before:right-10 before:translate-x-1/2 
        before:border-x-10 before:border-t-25 before:border-x-transparent before:border-t-black-900
        after:absolute after:top-full after:right-10 after:translate-x-1/2 
        after:border-x-9 after:border-t-21 after:border-x-transparent after:border-t-pink 
      '>
        <div className='w-auto max-h-full overflow-y-auto'>
          {message}
        </div>
      </div>
    </div>
  )
}

export default UserMessageBubble