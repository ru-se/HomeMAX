import React from 'react'
import Menu from '../components/menu/Menu'
import { useTasks } from '../contexts/TasksContext'

const Tasks = () => {
  const { tasks, completeTask } = useTasks();


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
                {task.status ? (
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