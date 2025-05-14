// 設定ページ

import React from 'react'

const Settings = () => {
  return (
    <>
    <div className="min-h-screen bg-white">
      <div className="flex flex-col gap-15 items-center pt-45">
        {/* 使い方 */}
        <button className="rounded-full bg-blue text-white py-4 w-2/6 font-kiwi-maru hover:bg-blue-dark">使い方</button>
        {/* ログアウト */}
        <button className="rounded-full  bg-blue text-white  py-4  w-2/6 font-kiwi-maru hover:bg-blue-dark">ログイン</button>
      </div>
    </div>
    </>
  )
}

export default Settings