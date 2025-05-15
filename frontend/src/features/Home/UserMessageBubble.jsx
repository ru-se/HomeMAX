// ユーザーの送信したメッセージの吹き出し

import React from 'react'

const UserMessageBubble = ({ message }) => {
  return (
    <div className='flex flex-col-reverse mb-10'>
      <div className='w-48 h-48 border-2 border-solid'>
        {message}
      </div>
    </div>
  )
}

export default UserMessageBubble