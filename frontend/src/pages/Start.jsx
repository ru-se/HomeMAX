// スタートページ

import React from 'react'
import { useNavigate } from "react-router-dom"; 
import homeImage from '../assets/home.png'; // 画像をインポート

const Start = () => {

  const navigate = useNavigate()

  return (
    <>
      <div className="min-h-screen bg-white flex  justify-center items-center relative overflow-hidden">

          {/* 背景の無限スクロール画像 */}
        <div className="absolute z-0">
          <div className="marquee">
          </div>
        </div>
        

        <div className="z-10 w-1/2 py-36 bg-white rounded border-1 border-white-dark shadow-lg">
          {/* タイトル */}
          <h1 className = "text-8xl text-center font-kiwi-maru">ほめマックス</h1>

            {/* 説明 */}
            <div className="font-kiwi-maru text-center mt-16">
              ようこそ!<br />
              「ほめマックス」へ！<br />
              <br />
              あなたの“がんばり”を全力で肯定してくれるほめマックス。<br />
              日常のこと、仕事のこと、恋愛のこと、悩んでること——<br />
              なんでも話してみてください。<br />
              <br />
              あなたの話に、キャラの「ほめマックス」が全力で、<br />
              愛と勢いとテンションでほめちぎってくれます！
            </div>

            <div className="flex gap-8 justify-center mt-12">
              {/* ログインボタン */}
            <button onClick={() => navigate('/login')} className="rounded-full bg-blue text-white px-6 py-2 font-kiwi-maru hover:bg-blue-dark">ログイン</button> 
              {/* 新規登録ボタン */}
            <button onClick={() => navigate('/signup')} className="rounded-full  bg-blue text-white px-6 py-2 font-kiwi-maru hover:bg-blue-dark">新規登録</button>
            </div>
        </div>
      </div>
    </>
  )
}

export default Start