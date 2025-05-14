// スタートページ

import React from 'react'

const Start = () => {
  return (
    <>
    <div className="min-h-screen bg-white">
      {/* タイトル */}
      <h1 className = "text-8xl text-center font-kiwi-maru mt45 pt-38">ほめマックス</h1>

        <div className="flex gap-8 justify-center mt-20">
          {/* ログインボタン */}
         <button className="rounded-full bg-blue text-white px-6 py-2 font-kiwi-maru hover:bg-blue-dark">ログイン</button> 
          {/* 新規登録ボタン */}
         <button className="rounded-full  bg-blue text-white px-6 py-2 font-kiwi-maru hover:bg-blue-dark">新規登録</button>
        </div>

      {/* 説明 */}
      <p className="text font-kiwi-maru text-center mt-15"> 
      ここに説明書くよ
      </p>
    </div>
</>
  )
}

export default Start