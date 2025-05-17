import React, {useState, useEffect } from 'react'

// 当たり前タスク完了時の通知
const NotificationToast = ({ message, onClose }) => {

  const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if(!message) return;
      
      const appearTimer = setTimeout(() => {
        setIsVisible(true);
      }, 10); // 表示時もほんの少し遅らせる
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000); // 5秒後に消す
  
      return () => clearTimeout(timer);
    }, [,message]);

    
  

  return (
    <div 
      className={`fixed flex items-center  top-4 right-4 bg-green border border-blue-dark text-black px-4 py-2 rounded shadow-lg z-50
       transition-transform duration-800 ease-out 
       ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <div>
        {message}
      </div>
      <button
        className="w-4 h-4 rounded flex items-center  hover:bg-green-dark" onClick={() => {
          setIsVisible(false)
          onClose()
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 384 512"
          className=''
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
        </svg>
      </button>
    </div>
  )
}

export default NotificationToast