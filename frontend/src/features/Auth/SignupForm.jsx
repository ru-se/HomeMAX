import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' 

const SignupForm = () => {
  const navigate = useNavigate()
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setSignupData({
      ...signupData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      })
      const data = await response.json()
      if (response.ok) {
        setSuccess('登録成功！ログインしてください')
        setTimeout(() => navigate('/login'), 1000)
      } else {
        setError(data.message || '登録に失敗しました')
      }
    } catch (err) {
      setError('通信エラーが発生しました')
    }
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <h2>サインアップ</h2>
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
            placeholder='ユーザー名'
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
            placeholder='メールアドレス'
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
            placeholder='パスワード'
          />
        </div>
        <button type='submit'>サインアップ</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
      </form>
    </div>
  )
}

export default SignupForm