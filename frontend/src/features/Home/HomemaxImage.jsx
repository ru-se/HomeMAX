// ほめマックスの画像

import React, { useState } from 'react'
import homemaxImg1 from '../../assets/homemax_01-2.png';
import homemaxImg2 from '../../assets/homemax_02.png';
import homemaxImg3 from '../../assets/homemax_03.png';
import homemaxImg4 from '../../assets/homemax_04.png';
import homemaxImg5 from '../../assets/homemax_05.png';
import homemaxImg6 from '../../assets/homemax_06.png';
import homemaxImg7 from '../../assets/homemax_07.png';
import { toast, cssTransition } from 'react-toastify'
import 'animate.css/animate.min.css';
import { useTasks } from '../../contexts/TasksContext';

const HomemaxImage = ({ OKCount }) => {

  // ほめマックスの画像を配列に格納
  const images = [
    homemaxImg1,
    homemaxImg2,
    homemaxImg3,
    homemaxImg4,
    homemaxImg5,
    homemaxImg6,
    homemaxImg7,
  ]

  // OKCount に基づいて画像を選択
  const selectedImage = images[OKCount] 
  
  const [hoverCount, setHoverCount] = useState(0)
  const [notified, setNotified] = useState(false)
  const { completeTaskByTitle } = useTasks();

  const bounce = cssTransition({
  enter: 'animate__animated animate__bounceIn',
  exit: 'animate__animated animate__bounceOut',
});
  const handleMouseEnter = async () => {
    // setHoverCount(prev => {
    //   const newCount = prev + 1
    //   if (newCount >= 6 && !notified) {
    //     const taskRes = await fetch('http://localhost:8000/task/update', {
    //           method: 'POST',
    //           headers: { 'Content-Type': 'application/json' },
    //           credentials: 'include',
    //           body: JSON.stringify({ task_title: "褒められた" }),
    //         });
    //         const taskData_ = await taskRes.json();
        
    //         if(!taskRes_compliment.status){
    //         // 返ってきたtask_titleでトースト
    //         toast(`${taskData_compliment.task_name}すごい！！`, {
    //           transition:bounce,
    //        style: {
    //         background: 'linear-gradient(90deg, #ff8a00, #e52e71, #00c3ff)',
    //         color: '#fff',
    //         fontWeight: 'bold',
    //         fontSize: '1.2rem',
    //         boxShadow: '0 0 20px #ff8a00, 0 0 40px #e52e71',
    //         border: '2px solid #fff',
    //         textShadow: '0 2px 8px #e52e71',
    //       }
    //         })
    //       }
    //     toast('撫でてくれてありがとう！すごい！！✨', {
    //        transition:bounce,
    //        style: {
    //         background: 'linear-gradient(90deg, #ff8a00, #e52e71, #00c3ff)',
    //         color: '#fff',
    //         fontWeight: 'bold',
    //         fontSize: '1.2rem',
    //         boxShadow: '0 0 20px #ff8a00, 0 0 40px #e52e71',
    //         border: '2px solid #fff',
    //         textShadow: '0 2px 8px #e52e71',
    //       }
    //     } )
    //     setNotified(true)
    //   }
    //   return newCount
    // })
    if (notified) return;
  const newCount = hoverCount + 1;
  setHoverCount(newCount);

  if (newCount >= 6) {
    const taskRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ task_title: "ほめマックスを撫でる" }),
    });
    const taskData = await taskRes.json();
    
    // 6回繰り返す
    for(let i = 0; i < 5; i++) {
    toast(`やさしく撫でられたほめマックスは、今、幸せゲージ MAX！すごい！！`, {
      transition: bounce,
      style: {
        background: 'linear-gradient(90deg, #ff8a00, #e52e71, #00c3ff)',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        boxShadow: '0 0 20px #ff8a00, 0 0 40px #e52e71',
        border: '2px solid #fff',
        textShadow: '0 2px 8px #e52e71',
      }
    });
  }

    // toast('撫でてくれてありがとう！すごい！！✨', {
    //   transition: bounce,
    //   style: {
    //     background: 'linear-gradient(90deg, #ff8a00, #e52e71, #00c3ff)',
    //     color: '#fff',
    //     fontWeight: 'bold',
    //     fontSize: '1.2rem',
    //     boxShadow: '0 0 20px #ff8a00, 0 0 40px #e52e71',
    //     border: '2px solid #fff',
    //     textShadow: '0 2px 8px #e52e71',
    //   }
    // });
    completeTaskByTitle("ほめマックスを撫でる");
    setNotified(true);
  } 
}

  return (
    <div>
      <div>
        <img 
          src={selectedImage} 
          alt="homemax" 
          onMouseEnter={handleMouseEnter}
          className='cursor-pointer'
        />
      </div>
    </div>
  )
}

export default HomemaxImage