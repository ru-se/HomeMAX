import React, { useContext, useState } from 'react'
import Menu from '../components/menu/Menu'
import { HistoryContext } from '../App'
import { FaCalendar, FaSearch } from 'react-icons/fa'

const History = () => {
  const { history } = useContext(HistoryContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // カテゴリでフィルタ
  const categories = ['all', '仕事', '恋愛', '人間関係', '趣味', '生活', '健康']
  
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.letter_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.compliment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           (item.positive_aspects && item.positive_aspects.includes(selectedCategory))
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            ほめほめ日記 📖
          </h1>
          <p className="text-xl text-gray-600">あなたの成長の記録</p>
        </div>

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
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg"
              />
            </div>

            {/* カテゴリフィルタ */}
            <div className="flex gap-2 overflow-x-auto">
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
          <div className="text-center py-20">
            <p className="text-3xl mb-4">📝</p>
            <p className="text-xl text-gray-500">
              {history.length === 0 
                ? 'まだ日記がありません。がんばったことを話してみよう！'
                : '該当する日記が見つかりませんでした。'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredHistory.map((item, idx) => {
              const letterDate = new Date(item.letter_date).toLocaleDateString("ja-JP", { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long',
                timeZone: "Asia/Tokyo" 
              })
              
              return (
                <div 
                  key={item.happiness_id || idx} 
                  className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 transform transition-all hover:scale-102 hover:shadow-2xl"
                >
                  {/* 日付ヘッダー */}
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-gray-200">
                    <FaCalendar className="text-pink-400 text-xl" />
                    <p className="text-lg font-bold text-gray-700">{letterDate}</p>
                  </div>

                  {/* メッセージと褒め言葉 */}
                  <div className="space-y-6">
                    {/* あなたのメッセージ */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                      <p className="text-sm font-bold text-blue-600 mb-3">あなたが話したこと：</p>
                      <p className="text-lg leading-relaxed">{item.letter_message}</p>
                    </div>

                    {/* ほめマックスの返信 */}
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200">
                      <p className="text-sm font-bold text-pink-600 mb-3">ほめマックスより 💖：</p>
                      <p className="text-lg leading-relaxed">{item.compliment}</p>
                    </div>

                    {/* カテゴリタグ */}
                    {item.positive_aspects && (
                      <div className="flex flex-wrap gap-2">
                        {item.positive_aspects.split('、').map((aspect, i) => (
                          <span 
                            key={i}
                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold"
                          >
                            #{aspect}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 統計サマリー */}
        {history.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
              あなたの成長の軌跡 🌟
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6">
                <p className="text-4xl font-bold text-pink-500">{history.length}</p>
                <p className="text-gray-600 mt-2">褒められた回数</p>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6">
                <p className="text-4xl font-bold text-purple-500">
                  {new Set(history.map(h => h.positive_aspects)).size}
                </p>
                <p className="text-gray-600 mt-2">挑戦したカテゴリ</p>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6">
                <p className="text-4xl font-bold text-blue-500">
                  {Math.floor(history.length / 7)}
                </p>
                <p className="text-gray-600 mt-2">継続週数</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Menu />
    </div>
  )
}

export default History