// サインアップフォーム

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' 

const SignupForm = () => {

  // useNavigateフックを使用して、ページ遷移を管理
  const navigate = useNavigate()
  
  // ユーザー情報の状態を管理
  const [signupData, setSignupData] = useState({
    userID: '',
    username: '',
    email: '',
    password: '',
  })

  // フォームの変更を処理する関数
  const handleChange = (e) => {
    const { name, value } = e.target
    setSignupData({
      ...signupData,
      [name]: value,
    })
  }

  // フォームの送信を処理する関数
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', signupData)
    // サーバーにデータを送信する処理をここに追加

    //サインアップ成功後にhomeページにリダイレクトする処理
    navigate('/home')
  }

  return (
    <div className="flex min-h-screen bg-white text-center font-kiwi-maru justify-center">
      <div className="w-2/5 my-10 mx-10 bg-white rounded shadow-xl/20">
        <form onSubmit={handleSubmit} className='w-full max-w-md space-y-6 mx-auto'>
          <h2 className="text-7xl mb-20 mt-10">サインアップ</h2>

          {/* ユーザー名 */}
          <div className="flex flex-row items-center mb-10">
            <label htmlFor="username" className="w-60">ユーザー名</label>
            <input
              type="text"
              id='username'
              name='username'
              value={signupData.username}
              onChange={handleChange}
              required
              autoComplete="name"
              placeholder='ユーザー名'
              className="border-1 border-black focus:outline-1 focus:outline-blue-dark inline-block py-1"
            />
          </div>

          {/* メールアドレス */}
          <div className="flex flex-row items-center mb-10">
            <label htmlFor="email" className="w-60">メールアドレス</label>
            <input
              type="email"
              id='email'
              name='email'
              value={signupData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder='メールアドレス'
              className="border-1 border-black focus:outline-1 focus:outline-blue-dark inline-block py-1"
            />
          </div>

          {/* パスワード */}
          <div className="flex flex-row items-center mb-10">
            <label htmlFor="password" className="w-60">パスワード</label>
            <input
              type="password"
              id='password'
              name='password'
              value={signupData.password} 
              onChange={handleChange}
              required
              autoComplete="password"
              placeholder='パスワード'
              className="border-1 border-black focus:outline-1 focus:outline-blue-dark inline-block py-1"
            />
          </div>

          {/* サインボタン */}
          <button type='submit' className="rounded-full bg-blue text-white px-16 py-4 font-kiwi-maru hover:bg-blue-dark">サインアップ</button>
        </form>
      </div>
    </div>
  )
}

export default SignupForm