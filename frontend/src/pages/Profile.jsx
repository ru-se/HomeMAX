import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/navigation/BottomNav';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center font-kiwi-maru">
                <p className="text-gray-500">ログインしてください</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pink-50 font-kiwi-maru pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-400 to-rose-400 text-white p-8">
                <h1 className="text-4xl font-black mb-2">👤 プロフィール</h1>
                <p className="text-lg opacity-90">{user.username}さんのページ</p>
            </div>

            {/* Profile Content */}
            <div className="p-6 max-w-2xl mx-auto">
                {/* User Info Card */}
                <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
                    <h2 className="text-2xl font-black text-gray-800 mb-4">ユーザー情報</h2>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">ユーザー名</span>
                            <span className="font-bold text-gray-800">{user.username}</span>
                        </div>

                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">レベル</span>
                            <span className="font-bold text-pink-500">Lv. {user.level}</span>
                        </div>

                        <div className="flex justify-between items-center py-3">
                            <span className="text-gray-600">メールアドレス</span>
                            <span className="font-bold text-gray-800 text-sm">{user.email}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg"
                    >
                        ログアウト
                    </button>
                </div>

                {/* Coming Soon */}
                <div className="mt-8 bg-white/50 rounded-2xl p-6 text-center">
                    <p className="text-gray-500 text-sm">設定機能は近日公開予定です</p>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default Profile;
