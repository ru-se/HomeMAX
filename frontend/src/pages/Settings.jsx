// 設定ページ

import React from 'react'

const Settings = () => {
  return (
    <>
    <div className="min-h-screen bg-white font-kiwi-maru">
      <div className="flex flex-col gap-15 items-center pt-45">
        {/* 使い方 */}
        <p className="w-1/3 text-center">使い方の文章</p>
        {/* ログアウト */}
        <button className="rounded-full  bg-blue text-white  py-4  w-1/4 hover:bg-blue-dark">ログイン</button>
      </div>
    </div>
    </>
  )
}

export default Settings