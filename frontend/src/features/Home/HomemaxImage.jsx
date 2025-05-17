// ほめマックスの画像

import React from 'react'
import homemaxImg1 from '../../assets/homemax_01-2.png';
import homemaxImg2 from '../../assets/homemax_02.png';
import homemaxImg3 from '../../assets/homemax_03.png';
import homemaxImg4 from '../../assets/homemax_04.png';
import homemaxImg5 from '../../assets/homemax_05.png';
import homemaxImg6 from '../../assets/homemax_06.png';
import homemaxImg7 from '../../assets/homemax_07.png';
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
  

  return (
    <div>
      <div>
        <img src={selectedImage} alt="homemax" />
      </div>
    </div>
  )
}

export default HomemaxImage