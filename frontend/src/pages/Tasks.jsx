import React, { useState } from 'react'
import Menu from '../components/menu/Menu'
import { useTasks } from '../contexts/TasksContext'
import { FaTrophy, FaTimes } from 'react-icons/fa'

const Tasks = () => {
  const { tasks } = useTasks()
  const [selectedTask, setSelectedTask] = useState(null)

  const completedCount = tasks.filter(t => t.status).length
  const totalCount = tasks.length

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative">
      <Menu />

      {/* 背景エフェクト */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 h-full flex flex-col px-8 py-12">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-black text-white mb-4 drop-shadow-2xl">
            実績システム
          </h1>
          <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur rounded-full px-8 py-4 border-2 border-white/50">
            <FaTrophy className="text-4xl text-yellow-400" />
            <span className="text-3xl font-bold text-white">
              {completedCount} / {totalCount}
            </span>
          </div>
        </div>

        {/* 実績アイコングリッド */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex items-center justify-center">
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 max-w-7xl">
              {tasks.map((task) => (
                <button
                  key={task.task_id}
                  onClick={() => setSelectedTask(task)}
                  className={`
                    group relative w-24 h-24 rounded-2xl transition-all transform hover:scale-110
                    ${task.status 
                      ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 shadow-2xl animate-glow' 
                      : 'bg-gray-700/50 backdrop-blur border-2 border-gray-600'
                    }
                  `}
                >
                  {/* アイコン（絵文字で代替） */}
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    {task.task_type === '隠しタスク' ? '🎁' : '🏆'}
                  </div>

                  {/* 未達成のロックアイコン */}
                  {!task.status && (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                      🔒
                    </div>
                  )}

                  {/* ホバー時のタイトル */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {task.task_title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 詳細モーダル */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedTask(null)}>
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-[3rem] shadow-2xl max-w-2xl w-full mx-8 p-12 relative border-4 border-yellow-400 animate-bounce-in" onClick={(e) => e.stopPropagation()}>
            {/* 閉じるボタン */}
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white text-xl transition-all transform hover:scale-110"
            >
              <FaTimes />
            </button>

            {/* 達成状態 */}
            <div className="text-center mb-8">
              <div className={`
                inline-block text-8xl mb-4
                ${selectedTask.status ? 'animate-bounce' : 'grayscale opacity-50'}
              `}>
                {selectedTask.task_type === '隠しタスク' ? '🎁' : '🏆'}
              </div>
              {selectedTask.status && (
                <div className="text-3xl font-black text-yellow-400 mb-2">
                  ✨ 達成済み ✨
                </div>
              )}
            </div>

            {/* タイトル */}
            <h3 className="text-4xl font-black text-center text-white mb-6">
              {selectedTask.task_title}
            </h3>

            {/* 説明 */}
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6 border-2 border-white/30">
              <p className="text-xl text-white leading-relaxed text-center">
                {selectedTask.task_name}
              </p>
            </div>

            {/* タイプ */}
            <div className="text-center">
              <span className={`
                inline-block px-6 py-3 rounded-full text-lg font-bold
                ${selectedTask.task_type === '隠しタスク'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900'
                  : 'bg-blue-500 text-white'
                }
              `}>
                {selectedTask.task_type}
              </span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.5); }
          50% { box-shadow: 0 0 40px rgba(251, 191, 36, 1); }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default Tasks