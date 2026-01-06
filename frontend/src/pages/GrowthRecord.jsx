import React, { useState, useEffect } from 'react';
import { useTasks } from '../contexts/TasksContext';
import { useAuth } from '../contexts/AuthContext';
import ShareCard from '../components/ShareCard';
import Menu from '../components/menu/Menu';
import ParticleField from '../components/ParticleField';
import BottomNav from '../components/navigation/BottomNav';
import { Link } from 'react-router-dom';

const GrowthRecord = () => {
    const { user } = useAuth();
    const [praiseData, setPraiseData] = useState(null); // { taskName, praise }
    const [tasks, setTasks] = useState([
        { id: 1, title: '早起き' },
        { id: 2, title: '勉強' },
        { id: 3, title: '運動' },
        { id: 4, title: '掃除' },
        { id: 5, title: '自炊' },
        { id: 6, title: '睡眠' },
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
        <div className="min-h-screen bg-[#fff0f5] relative overflow-hidden font-kiwi-maru">
            <ParticleField />

            {/* Header */}
            <div className="relative z-10 p-6 flex justify-between items-center text-[#db2777]">
                <h1 className="text-2xl font-bold">成長記録</h1>
                <div className="flex gap-2">
                    <Link to="/achievements" className="bg-[#fff5f7] border border-[#fbcfe8] px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-[#fce7f3] transition-colors text-[#db2777]">
                        称号
                    </Link>
                    <Link to="/home" className="bg-[#fff5f7] border border-[#fbcfe8] px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-[#fce7f3] transition-colors text-[#db2777]">
                        ホームへ
                    </Link>
                </div>
            </div>

            {/* Task Grid */}
            <div className="relative z-10 px-4 pb-28 max-w-4xl mx-auto">
                <p className="text-center text-[#db2777] opacity-80 mb-8">今日の「できた！」を記録しよう</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                        <button
                            key={task.id}
                            onClick={() => handleTaskClick(task)}
                            disabled={task.isLoading}
                            className={`
                                bg-[#fff5f7] border-2 border-dashed border-[#fbcfe8]
                                active:translate-y-1 transition-all rounded-3xl p-6 
                                flex flex-col items-center justify-center gap-3 aspect-square 
                                shadow-md hover:shadow-lg relative text-[#db2777]
                            `}
                        >
                            {task.isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-3xl">
                                    <div className="animate-spin h-8 w-8 border-4 border-[#db2777] border-t-transparent rounded-full"></div>
                                </div>
                            ) : null}
                            <span className="text-lg font-bold">{task.title}</span>
                        </button>
                    ))}

                    {/* Placeholder for custom add */}
                    <button className="border-2 border-dashed border-[#fbcfe8] bg-white/50 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 aspect-square text-[#db2777] opacity-60 hover:opacity-100 hover:bg-[#fff5f7] transition-all">
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

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default GrowthRecord;
