// ルーティング設定

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import Start from '../pages/Start'
import Signup from '../pages/Signup'
import Home from '../pages/Home';
import Tasks from '../pages/Tasks';
import History from '../pages/History';
import Settings from '../pages/Settings';
import Login from '../pages/Login';

const AppRoutes = () => {

// 認証状態を管理するためのフラグ
// 仮でtrueに設定しているが、実際には認証状態を管理するためのロジックを実装する
  const isAuthenticated = true;

  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* 認証が必要なルート */}
      {isAuthenticated ? (
        <>
          {/* 認証後にアクセスできるページ */}
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </>
      ) : (
        <>
          {/* 未認証の場合にログインにリダイレクト */}
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="/tasks" element={<Navigate to="/" />} />
          <Route path="/history" element={<Navigate to="/" />} />
          <Route path="/settings" element={<Navigate to="/" />} />
        </>
      )}
      {/* その他の場合はStartにリダイレクト */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  )
}

export default AppRoutes