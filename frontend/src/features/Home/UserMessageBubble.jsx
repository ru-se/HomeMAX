// ユーザーの送信したメッセージの吹き出し

import React from 'react'

const UserMessageBubble = ({ message }) => {
  return (
    <div className='w-48 h-48 border-2 border-solid'>
      <div>
        {message}
      </div>
    </div>
  )
}

export default UserMessageBubble