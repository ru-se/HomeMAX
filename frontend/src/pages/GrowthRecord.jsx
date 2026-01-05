import React, { useState, useEffect } from 'react';
import { useTasks } from '../contexts/TasksContext';
import { useAuth } from '../contexts/AuthContext';
import ShareCard from '../components/ShareCard';
import Menu from '../components/menu/Menu';
import ParticleField from '../components/ParticleField';
import { Link } from 'react-router-dom';

const GrowthRecord = () => {
    const { user } = useAuth();
    const [praiseData, setPraiseData] = useState(null); // { taskName, praise }
    const [tasks, setTasks] = useState([
        { id: 1, title: '早起き', icon: '☀️', color: 'bg-orange-100 border-orange-200' },
        { id: 2, title: '勉強', icon: '📚', color: 'bg-blue-100 border-blue-200' },
        { id: 3, title: '運動', icon: '🏃', color: 'bg-green-100 border-green-200' },
        { id: 4, title: '掃除', icon: '🧹', color: 'bg-purple-100 border-purple-200' },
        { id: 5, title: '自炊', icon: '🍳', color: 'bg-yellow-100 border-yellow-200' },
        { id: 6, title: '睡眠', icon: '🛌', color: 'bg-indigo-100 border-indigo-200' },
    ]);

    const handleTaskClick = async (task) => {
        let res; // Define res outside try block
        try {
            // Loading state tracking
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, isLoading: true } : t));

            // API Call
            res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    task_title: task.title,
                    icon: task.icon,
                    color: task.color,
                    xp: 10, // Default XP per task
                    category: 'daily' // Simple default for now
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                // Check specifically for 401 here inside the try block where res is valid
                if (res.status === 401) {
                    alert("セッションが切れました。再度ログインしてください。");
                    window.location.href = '/login';
                    return; // Stop execution
                }
                throw new Error("API Error"); // To jump to catch for other errors
            }

            if (res.ok) {
                setPraiseData({
                    taskName: data.task_name,
                    praise: data.praise
                });

                // Play sound or voice here if desired
                const synth = window.speechSynthesis;
                if (synth) {
                    const u = new SpeechSynthesisUtterance(data.praise);
                    u.lang = 'ja-JP';
                    console.log('[CAPTURED_PRAISE_GROWTH] ' + data.praise);
                    synth.speak(u);
                }

                // Check for newly unlocked achievements
                try {
                    await fetch(`${import.meta.env.VITE_API_BASE_URL}/achievements/check`, {
                        method: 'POST',
                        credentials: 'include'
                    });
                } catch (achievementError) {
                    console.error("Achievement check error:", achievementError);
                }
            }
        } catch (error) {
            console.error("Task update error:", error);
        } finally {
            setTasks(prev => prev.map(t => t.id === task.id ? { ...t, isLoading: false } : t));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 relative overflow-hidden font-kiwi-maru">
            <ParticleField />

            {/* Header */}
            <div className="relative z-10 p-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">🌱 成長記録</h1>
                <div className="flex gap-2">
                    <Link to="/achievements" className="bg-yellow-100/80 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-yellow-100 transition-colors">
                        🏆 称号
                    </Link>
                    <Link to="/home" className="bg-white/80 px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-white transition-colors">
                        🏠 ホームへ
                    </Link>
                </div>
            </div>

            {/* Task Grid */}
            <div className="relative z-10 px-4 pb-20 max-w-4xl mx-auto">
                <p className="text-center text-gray-600 mb-8">今日の「できた！」をタップしてね</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                        <button
                            key={task.id}
                            onClick={() => handleTaskClick(task)}
                            disabled={task.isLoading}
                            className={`${task.color} border-b-4 active:border-b-0 active:translate-y-1 transition-all rounded-3xl p-6 flex flex-col items-center justify-center gap-3 aspect-square shadow-sm hover:shadow-md bg-opacity-80 backdrop-blur-sm relative`}
                        >
                            {task.isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-3xl">
                                    <div className="animate-spin h-8 w-8 border-4 border-pink-400 border-t-transparent rounded-full"></div>
                                </div>
                            ) : null}
                            <span className="text-5xl drop-shadow-sm">{task.icon}</span>
                            <span className="text-lg font-bold text-gray-700">{task.title}</span>
                        </button>
                    ))}

                    {/* Placeholder for custom add */}
                    <button className="border-2 border-dashed border-gray-300 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 aspect-square text-gray-400 hover:bg-gray-50 transition-colors">
                        <span className="text-4xl">+</span>
                        <span className="text-sm font-bold">追加する</span>
                    </button>
                </div>
            </div>

            {/* Share Modal */}
            {praiseData && (
                <ShareCard
                    taskName={praiseData.taskName}
                    praise={praiseData.praise}
                    onClose={() => setPraiseData(null)}
                />
            )}

            {/* Menu */}
            {/* <Menu /> */}
        </div>
    );
};

export default GrowthRecord;
