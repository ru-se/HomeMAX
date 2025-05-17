import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/menu/menu';

const SettingsPage = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        credentials: 'include', // セッションを使う場合
      });
      const data = await response.json();
      if (response.ok) {
        console.log('ログアウト成功');
        navigate('/');
      } else {
        setError(data.message || 'ログアウトに失敗しました');
      }
    } catch (err) {
      setError('通信エラーが発生しました');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white font-kiwi-maru">
        <div className="flex flex-col gap-15 items-center pt-45">
          {/* 使い方 */}
          <p className="w-1/3 text-center">使い方の文章</p>
          <p>送信は、送信ボタンまたはEnterをクリック!</p>
          <p>改行は、Shift+Enter</p>

          {/* ログアウト */}
          <form onSubmit={handleSubmit} className='w-full max-w-md space-y-6 mx-auto flex justify-center'>
            <button type="submit"
              className="rounded-full bg-blue text-white px-16 py-4 font-kiwi-maru hover:bg-blue-dark">
              ログアウト
            </button>
          </form>
        </div>
        <Menu />
      </div>
    </>
  );
};

export default SettingsPage;

