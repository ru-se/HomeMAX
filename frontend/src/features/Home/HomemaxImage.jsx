// ほめマックスの画像

import React from 'react'
import homemaxImg from '../../assets/homemax_01.png'; // ← 画像をインポート

const HomemaxImage = () => {
  return (
    <div>
      <div>
        <img src={homemaxImg} alt="homemax" />
      </div>
    </div>
  )
}

export default HomemaxImage