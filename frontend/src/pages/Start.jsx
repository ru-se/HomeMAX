// スタートページ

import React from 'react'
import { useNavigate } from "react-router-dom";

const Start = () => {

  const navigate = useNavigate()

  return (
    <>
      <div className="min-h-screen bg-white min-h-screen flex justify-center items-center">
        <div className="">
          {/* タイトル */}
          <h1 className = "text-8xl text-center font-kiwi-maru">ほめマックス</h1>

            <div className="flex gap-8 justify-center mt-20">
              {/* ログインボタン */}
            <button onClick={() => navigate('/login')} className="rounded-full bg-blue text-white px-6 py-2 font-kiwi-maru hover:bg-blue-dark">ログイン</button> 
              {/* 新規登録ボタン */}
            <button onClick={() => navigate('/signup')} className="rounded-full  bg-blue text-white px-6 py-2 font-kiwi-maru hover:bg-blue-dark">新規登録</button>
            </div>

          {/* 説明 */}
          <div className="font-kiwi-maru text-center mt-16">
            ようこそ!<br />
            「ほめマックス」へ！<br />
            あなたの“がんばり”を全力で肯定してくれるほめマックス。<br />
            日常のこと、仕事のこと、恋愛のこと、悩んでること——<br />
            なんでも話してみてください。<br />
            あなたの話に、キャラの「ほめマックス」が全力で、<br />
            愛と勢いとテンションでほめちぎってくれます！


          </div>
        </div>
      </div>
    </>
  )
}

export default Start