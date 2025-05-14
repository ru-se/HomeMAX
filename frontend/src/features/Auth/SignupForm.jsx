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
    <div className="">
      <form onSubmit={handleSubmit}>
        <h2>サインアップ</h2>
        <div>
          <label htmlFor="userID">ユーザーID</label>
          <input
            type="text"
            id='userID'
            name='userID'
            value={signupData.userID}
            onChange={handleChange}
            required
            autoComplete="userID"
          />
        </div>
        <div>
          <label htmlFor="username">ユーザー名</label>
          <input
            type="text"
            id='username'
            name='username'
            value={signupData.username}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id='email'
            name='email'
            value={signupData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id='password'
            name='password'
            value={signupData.password} 
            onChange={handleChange}
            required
            autoComplete="password"
          />
        </div>
        <button type='submit'>サインアップ</button>
      </form>
    </div>
  )
}

export default SignupForm