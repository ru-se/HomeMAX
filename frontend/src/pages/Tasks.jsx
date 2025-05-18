import React, { useEffect, useState } from 'react'
import Menu from '../components/menu/menu'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ユーザーID取得
  useEffect(() => {
    fetch('http://localhost:8000/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user.user_id) {
          setUserId(data.user.user_id)
        }
      })
      .catch(() => setError('ユーザー情報取得エラー'))
  }, [])

  // タスク一覧取得
  useEffect(() => {
    if (!userId) return
    setLoading(true)
    fetch(`http://localhost:8000/task/list?user_id=${userId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setTasks(data)
        setLoading(false)
      })
      .catch(() => {
        setError('タスク取得エラー')
        setLoading(false)
      })
  }, [userId])

  // タスクのステータス更新
  const handleUpdate = async (task_name) => {
    try {
      const res = await fetch('http://localhost:8000/task/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ task_name }),
      })
      const data = await res.json()
      if (res.ok) {
        // 更新後に再取得
        setTasks(tasks =>
          tasks.map(t =>
            t.task_name === task_name ? { ...t, status: 'true' } : t
          )
        )
      } else {
        setError(data.error || '更新に失敗しました')
      }
    } catch {
      setError('通信エラー')
    }
  }

  if (loading) return <div>読み込み中...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-white font-kiwi-maru flex flex-col items-center py-16">
      <h2 className="text-6xl mb-12 mt-8 text-center">タスク一覧</h2>
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {tasks.length === 0 ? (
  <div className="text-center text-lg text-gray-500">タスクがありません。</div>
) : (
  tasks.map(task => (
    <div key={task.task_id} className="flex items-center justify-between px-6 py-4 bg-blue-100 rounded shadow">
      <div>
        <div className="font-bold text-xl">{task.task_title}</div>
        <div className="text-base">{task.task_name}</div>
        <div className="text-xs text-gray-500">{task.task_type}</div>
      </div>
      <div>
        {task.status === 'true' ? (
          <span className="text-green-600 font-bold">完了</span>
        ) : (
          <span className="text-red-600 font-bold">未完了</span>
        )}
      </div>
    </div>
  ))
)}
      
      </div>
      <Menu />
    </div>
  )
}

export default Tasks
