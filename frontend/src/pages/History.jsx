import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaCalendar, FaSearch } from 'react-icons/fa'
import Menu from '../components/menu/Menu'
import BottomNav from '../components/navigation/BottomNav'
import ParticleField from '../components/ParticleField'
import CalendarComponent from '../components/CalendarComponent'

const History = () => {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  // フィルタ用
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedDiary, setSelectedDiary] = useState(null) // モーダル用
  const categories = ['all', '仕事', '恋愛', '人間関係', '趣味', '生活', '健康', 'その他']

  // 日付比較ヘルパー
  const isSameDate = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  // 1. APIから履歴データを取得
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/compliment/history?user_id=${user.user_id}`, {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        })

        if (!response.ok) throw new Error('履歴の取得に失敗しました')

        const data = await response.json()

        // 2. データをUI用に整形 (APIの入れ子構造をフラットにする)
        const formattedData = data.map(item => ({
          id: item.happiness_id,
          happiness_id: item.happiness_id,
          letter_message: item.letters ? item.letters.message : '(手紙の内容なし)',
          compliment: item.compliment,
          letter_date: item.created_at, // 作成日
          positive_aspects: item.positive_aspects || '',
          reactions: item.reactions || [] // リアクション配列
        }))

        setHistory(formattedData)
      } catch (err) {
        console.error(err)
        setError('履歴を読み込めませんでした')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [user])

  // 3. フィルタリングロジック
  const filteredHistory = history.filter(item => {
    const matchesSearch =
      (item.letter_message && item.letter_message.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.compliment && item.compliment.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === 'all' ||
      (item.positive_aspects && item.positive_aspects.includes(selectedCategory))

    const matchesDate = !selectedDate || isSameDate(new Date(item.letter_date), selectedDate)

    return matchesSearch && matchesCategory && matchesDate
  })

  // モーダルコンポーネント
  const DiaryModal = ({ item, onClose }) => {
    if (!item) return null;
    const itemId = item.happiness_id || item.id;
    const letterDate = new Date(item.letter_date).toLocaleDateString("ja-JP", {
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: "Asia/Tokyo"
    })

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
        <div className="bg-[#fff0f5] w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl relative z-10 border-4 border-pink-100 flex flex-col animate-bounce-in">

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-pink-400 p-2 rounded-full transition-all z-20 shadow-sm"
          >
            ✕
          </button>

          <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
            <div className="text-center border-b border-pink-200 pb-4">
              <h2 className="text-xl md:text-2xl font-bold text-[#db2777]">{letterDate}</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50/80 p-5 rounded-2xl text-gray-700 leading-relaxed border border-blue-100">
                <span className="block text-xs font-bold text-blue-400 mb-2">あなた</span>
                {item.letter_message}
              </div>
              <div className="bg-white p-5 rounded-2xl text-[#db2777] leading-relaxed border border-pink-100 shadow-sm relative">
                <span className="block text-xs font-bold text-pink-400 mb-2">ほめマックス</span>
                {item.compliment}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {item.positive_aspects && (
                item.positive_aspects.split(/,|、/).map((aspect, i) => {
                  const tag = aspect.trim();
                  if (tag.length > 20 || tag.includes('要素が抽出')) return null;
                  return (
                    <span key={i} className="px-3 py-1 bg-white text-pink-400 border border-pink-100 rounded-lg text-sm font-bold">
                      #{tag}
                    </span>
                  );
                })
              )}
            </div>

            <div className="mt-8 pt-6 border-t-2 border-dashed border-pink-200">
              <h3 className="text-lg font-bold text-gray-600 mb-4 flex items-center gap-2">
                <span>📮</span> 届いたメッセージ
              </h3>

              {item.reactions && item.reactions.length > 0 ? (
                <div className="space-y-4">
                  {item.reactions.map((reaction) => (
                    <div key={reaction.reaction_id} className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-700 text-sm">
                          {reaction.guest_name || '名無しさん'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(reaction.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">
                          {reaction.stamp_type === 'heart' && '❤️'}
                          {reaction.stamp_type === 'star' && '⭐'}
                          {reaction.stamp_type === 'fire' && '🔥'}
                          {reaction.stamp_type === 'clap' && '👏'}
                        </span>
                      </div>
                      {reaction.message && (
                        <p className="text-gray-600 text-sm bg-white/50 p-2 rounded-lg">
                          {reaction.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
                  まだメッセージは届いていません
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-[#fff0f5] border-t border-pink-200">
            <button
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/share/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ happiness_id: itemId })
                  });
                  if (!res.ok) throw new Error('Link creation failed');
                  const { share_token } = await res.json();
                  const shareUrl = `${window.location.origin}/share/${share_token}`;
                  await navigator.clipboard.writeText(shareUrl);
                  alert("魔法のリンクをコピーしました！\n誰かに送って、リアクションをもらっちゃおう！");
                } catch (e) {
                  console.error(e);
                  alert("シェア失敗...");
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <span className="text-xl">💌</span>
              <span>魔法のリンクで誰かに褒めてもらう</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff0f5] pb-24 font-kiwi-maru relative overflow-hidden">
      <ParticleField />

      {/* メイングリッドコンテナ */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10">

        {/* ヘッダー */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#db2777] mb-2">
            ほめほめ日記
          </h1>
          <p className="text-gray-500 text-sm md:text-base">あなたの成長の記録</p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="text-center bg-red-100 text-red-500 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Calendar */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 order-1">
            <CalendarComponent
              history={history}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />

            {/* 統計サマリー */}
            {history.length > 0 && (
              <div className="mt-6 bg-white/60 backdrop-blur rounded-3xl p-6 shadow-sm border border-pink-100 hidden lg:block">
                <h3 className="text-lg font-bold text-[#db2777] mb-4 text-center">日記データ</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 font-bold text-sm">書いた回数</span>
                  <span className="text-2xl font-extrabold text-[#db2777]">{history.length}回</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-bold text-sm">継続レベル</span>
                  <span className="text-2xl font-extrabold text-[#db2777]">{Math.max(1, Math.floor(history.length / 3))}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Search & List */}
          <div className="lg:col-span-8 order-2 space-y-6">

            {/* 検索・フィルタエリア */}
            <div className="bg-[#fffaf5] rounded-3xl shadow-sm border-2 border-dashed border-[#fbcfe8] p-6">
              <div className="flex flex-col gap-4">
                {/* 検索バー */}
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-300" />
                  <input
                    type="text"
                    placeholder="日記をキーワードで検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-[#fbcfe8] rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-200 text-lg transition-all text-[#db2777] placeholder-pink-200 bg-white"
                  />
                </div>

                {/* カテゴリフィルタ */}
                <div>
                  <p className="text-xs font-bold text-pink-400 mb-2 px-1">ジャンルで絞り込み</p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`
                                     px-4 py-2 rounded-full font-bold whitespace-nowrap transition-all transform hover:scale-105 text-sm
                                     ${selectedCategory === cat
                            ? 'bg-[#db2777] text-white shadow-md'
                            : 'bg-white text-pink-400 border border-pink-100 hover:bg-pink-50'
                          }
                                 `}
                      >
                        {cat === 'all' ? 'すべて' : cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* リスト表示 */}
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-400 mb-4"></div>
                <p className="text-gray-500">思い出を整理中...</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-20 bg-white/50 rounded-3xl backdrop-blur border border-dashed border-pink-200">
                <p className="text-6xl mb-4 opacity-50">🍃</p>
                <p className="text-lg text-pink-400 font-bold">
                  {selectedDate
                    ? `${selectedDate.toLocaleDateString()} の日記はありませんでした`
                    : '条件に合う日記が見つかりませんでした'
                  }
                </p>
                {history.length === 0 && (
                  <Link to="/home" className="inline-block mt-6 bg-[#db2777] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#be185d] transition-colors">
                    ホームへ戻る
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* 日付フィルタ中であることを表示 */}
                {selectedDate && (
                  <div className="flex items-center justify-between bg-pink-100 px-4 py-2 rounded-xl text-pink-600 text-sm font-bold shadow-sm">
                    <span>{selectedDate.toLocaleDateString()} の日記を表示中</span>
                    <button onClick={() => setSelectedDate(null)} className="hover:underline">すべて表示</button>
                  </div>
                )}
                {filteredHistory.map((item) => {
                  const letterDate = new Date(item.letter_date).toLocaleDateString("ja-JP", {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    weekday: 'short'
                  })
                  const hasReactions = item.reactions && item.reactions.length > 0;

                  // Use happiness_id as primary ID if available
                  const itemId = item.happiness_id || item.id;

                  return (
                    <div
                      key={itemId}
                      onClick={() => setSelectedDiary(item)}
                      className="bg-white hover:bg-pink-50 rounded-2xl p-5 cursor-pointer transform transition-all hover:scale-[1.01] shadow-sm border-2 border-transparent hover:border-pink-200 group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-bold text-pink-400 bg-pink-50 px-2 py-1 rounded-lg">
                              {letterDate}
                            </span>
                            {/* リアクションバッジ */}
                            {hasReactions && (
                              <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                                <span>📮</span>
                                <span>{item.reactions.length}件のメッセージ</span>
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 font-bold line-clamp-1 mb-1">
                            {item.letter_message}
                          </p>
                          <p className="text-sm text-pink-400 line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {item.compliment}
                          </p>
                        </div>
                        <div className="text-pink-300 group-hover:translate-x-1 transition-transform">
                          ▶
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* モーダル表示 */}
      {selectedDiary && (
        <DiaryModal item={selectedDiary} onClose={() => setSelectedDiary(null)} />
      )}

      <BottomNav />
    </div>
  )
}

export default History