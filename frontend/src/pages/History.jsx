import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaCalendar, FaSearch } from 'react-icons/fa'
import Menu from '../components/menu/Menu'
import BottomNav from '../components/navigation/BottomNav'

const History = () => {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  // フィルタ用
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const categories = ['all', '仕事', '恋愛', '人間関係', '趣味', '生活', '健康', 'その他']

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
          id: item.happiness_id, // DBのカラム名は happiness_id
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

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pb-20 font-kiwi-maru">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 leading-tight">
            ほめほめ日記 📖
          </h1>
          <p className="text-lg md:text-xl text-gray-600">あなたの成長の記録</p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="text-center bg-red-100 text-red-500 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {/* ローディング表示 */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-400 mb-4"></div>
            <p className="text-gray-500">思い出を整理中...</p>
          </div>
        ) : (
          <>
            {/* 検索とフィルタ */}
            <div className="mb-8 bg-white/80 backdrop-blur rounded-3xl shadow-xl p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* 検索バー */}
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="日記を検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg transition-all"
                  />
                </div>

                {/* カテゴリフィルタ */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`
                                                px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all transform hover:scale-105
                                                ${selectedCategory === cat
                          ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg scale-105'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }
                                            `}
                    >
                      {cat === 'all' ? 'すべて' : cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 履歴表示 */}
            {filteredHistory.length === 0 ? (
              <div className="text-center py-20 bg-white/50 rounded-3xl backdrop-blur">
                <p className="text-6xl mb-4">📝</p>
                <p className="text-xl text-gray-500">
                  {history.length === 0
                    ? 'まだ日記がありません。ホームに戻って、がんばったことを話してみよう！'
                    : '条件に合う日記が見つかりませんでした。'
                  }
                </p>
                {history.length === 0 && (
                  <Link to="/home" className="inline-block mt-6 bg-[#9C6924] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#8a5d20] transition-colors">
                    ホームへ戻る
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {filteredHistory.map((item) => {
                  const letterDate = new Date(item.letter_date).toLocaleDateString("ja-JP", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                    timeZone: "Asia/Tokyo"
                  })
                  const timeStr = new Date(item.letter_date).toLocaleTimeString("ja-JP", {
                    hour: '2-digit', minute: '2-digit'
                  })

                  return (
                    <div
                      key={item.id}
                      className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 md:p-8 transform transition-all hover:scale-[1.01] hover:shadow-2xl border border-white"
                    >
                      {/* 日付ヘッダー */}
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
                        <div className="bg-pink-100 p-3 rounded-full text-pink-500">
                          <FaCalendar />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-gray-700">{letterDate}</p>
                          <p className="text-sm text-gray-400">{timeStr}</p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-8">
                        {/* 左：あなたの手紙 */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">あなた</span>
                          </div>
                          <div className="bg-blue-50/50 p-6 rounded-2xl text-gray-700 leading-relaxed border border-blue-100 relative">
                            {item.letter_message}
                          </div>
                        </div>

                        {/* 右：ほめマックスの返信 */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 justify-end md:justify-start">
                            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold">ほめマックス</span>
                          </div>
                          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-2xl text-[#9C6924] leading-relaxed border border-pink-100 shadow-sm">
                            {item.compliment}
                          </div>
                        </div>
                      </div>

                      {/* カテゴリタグ & シェアボタン */}
                      <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                          {item.positive_aspects && (
                            item.positive_aspects.split(/,|、/).map((aspect, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold"
                              >
                                #{aspect.trim()}
                              </span>
                            ))
                          )}
                        </div>

                        {/* シェアボタン */}
                        <button
                          onClick={async () => {
                            try {
                              // 1. トークン生成APIをたたく
                              const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/share/create`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify({ happiness_id: item.id }) // item.id is homemax.happiness_id
                              });
                              if (!res.ok) throw new Error('リンク生成失敗');
                              const { share_token } = await res.json();

                              // 2. URLを構築
                              const shareUrl = `${window.location.origin}/share/${share_token}`;

                              // 3. クリップボードにコピー
                              await navigator.clipboard.writeText(shareUrl);
                              alert("魔法のリンクをコピーしました！\n" + shareUrl); // Todo: Toast replace
                            } catch (e) {
                              console.error(e);
                              alert("シェアできませんでした...");
                            }
                          }}
                          className="flex items-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-600 px-4 py-2 rounded-full font-bold transition-all transform active:scale-95"
                        >
                          <span>💌</span> 魔法のリンクを共有
                        </button>
                      </div>

                      {/* リアクション表示エリア */}
                      {item.reactions && item.reactions.length > 0 && (
                        <div className="mt-6 bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
                          <h4 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2">
                            <span>📮</span> 届いたリアクション
                          </h4>
                          <div className="space-y-3">
                            {item.reactions.map((reaction) => (
                              <div key={reaction.reaction_id} className="bg-white p-3 rounded-xl shadow-sm flex items-start gap-3">
                                <div className="text-2xl bg-gray-50 p-2 rounded-lg">
                                  {reaction.stamp_type === 'heart' && '💖'}
                                  {reaction.stamp_type === 'clap' && '👏'}
                                  {reaction.stamp_type === 'fire' && '🔥'}
                                  {reaction.stamp_type === 'cry' && '😭'}
                                  {/* Fallback for old data or unknown types */}
                                  {!['heart', 'clap', 'fire', 'cry'].includes(reaction.stamp_type) && '✨'}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-gray-700 text-sm">{reaction.guest_name}</span>
                                    <span className="text-xs text-gray-400">
                                      {new Date(reaction.created_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {reaction.message && (
                                    <p className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-lg inline-block">
                                      {reaction.message}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* 統計サマリー */}
            {history.length > 0 && (
              <div className="mt-16 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-3xl shadow-xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"></div>
                <h3 className="text-2xl font-bold mb-8 text-gray-800 flex items-center justify-center gap-2">
                  <span>🌟</span> あなたの成長の軌跡 <span>🌟</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm">
                    <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-rose-400">
                      {history.length}
                    </p>
                    <p className="text-gray-600 mt-2 font-bold text-sm">褒められた回数</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm">
                    <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-indigo-400">
                      {new Set(history.map(h => h.positive_aspects)).size}
                    </p>
                    <p className="text-gray-600 mt-2 font-bold text-sm">獲得した称号</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm">
                    <p className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-cyan-400">
                      {Math.max(1, Math.floor(history.length / 3))}
                    </p>
                    <p className="text-gray-600 mt-2 font-bold text-sm">継続レベル</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* メニューバー (必要であれば) */}
      {/* <Menu /> */}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}

export default History