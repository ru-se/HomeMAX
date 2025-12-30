
import React, { createContext, useContext } from 'react';
import { toast } from 'react-toastify';

const TasksContext = createContext();

export const useTasks = () => useContext(TasksContext);

export const TasksProvider = ({ children }) => {

    // タスク完了処理（タイトル指定）
    const completeTaskByTitle = async (title) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task_title: title }),
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(`${data.task_name}！えらい！`, {
                    style: { background: 'linear-gradient(90deg, #FFE3E3, #FFE3E3)' }
                });
            }
        } catch (error) {
            console.error("Task update error:", error);
        }
    };

    return (
        <TasksContext.Provider value={{ completeTaskByTitle }}>
            {children}
        </TasksContext.Provider>
    );
};