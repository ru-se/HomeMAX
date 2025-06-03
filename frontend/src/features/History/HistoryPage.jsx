import React, { useContext } from 'react'
import Menu from '../../components/menu/Menu'
import { HistoryContext } from '../../App'
const HistoryPage = () => {
  const { history } = useContext(HistoryContext);

  return (
    <div className="min-h-screen bg-white font-kiwi-maru flex flex-col items-center py-16">
      <h2 className="text-6xl mb-12 mt-8 text-center">ほめほめ日記</h2>
      <div className="mb-8">
      </div>
      <div className="w-full max-w-2xl flex flex-col gap-8">
      <div className="relative w-[700px] h-[800px] mx-auto bg-white/90 shadow text-[16px]">
      {/* 赤い縦線 */}
      <div className="absolute left-[45px] top-0 h-full w-[2px] bg-red-400/40"></div>

      {/* 穴 */}
      <div className="absolute left-[10px] w-[25px] h-[25px] bg-white rounded-full shadow-inner top-[10%] z-10"></div>
      <div className="absolute left-[10px] w-[25px] h-[25px] bg-white rounded-full shadow-inner top-[30%] -translate-y-1/2 z-10"></div>
      <div className="absolute left-[10px] w-[25px] h-[25px] bg-white rounded-full shadow-inner bottom-[50%] z-10"></div>
      <div className="absolute left-[10px] w-[25px] h-[25px] bg-white rounded-full shadow-inner bottom-[10%] z-10"></div>
      <div className="absolute left-[10px] w-[25px] h-[25px] bg-white rounded-full shadow-inner bottom-[30%] z-10"></div>

      {/* 罫線 */}
      <div className="absolute top-[40px] left-0 w-full h-[calc(100%-40px)] bg-[repeating-linear-gradient(white_0px,_white_24px,_steelblue_25px)]">
        {/* テキストエリア */}
        <div
          className="absolute top-[25px] left-[55px] right-[10px] bottom-[10px] font-[Indie_Flower] leading-[25px] overflow-y-auto outline-none"
          contentEditable={false} // contentEditableを無効化
          dangerouslySetInnerHTML={{
            __html: history.length === 0
              ? '<div class="text-center text-lg text-gray-500">履歴はまだありません。</div>'
              : history.map((item, idx) => {
                  const letterDate = new Date(item.letter_date).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }); // JSTに変換
                  const complimentDate = new Date(item.compliment_date).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }); // JSTに変換
                  return `
                    <div key="${item.happiness_id || idx}" class="flex flex-col items-end mb-8">
                      <div class="custom-box relative bg-pink">
                        <div class="font-bold pt-4">お手紙</div>
                        <div>${item.letter_message}</div>
                        <div class="text-xs text-gray-400">${letterDate}</div>
                        <div class="before-shape"></div>
                        <div class="after-shape"></div>
                      </div>
                      <div class="custom-box relative self-start mt-4 bg-green">
                        <div class="font-bold pt-4">褒め言葉</div>
                        <div>${item.compliment}</div>
                        <div class="before-shape"></div>
                        <div class="after-shape"></div>
                        <div class="text-xs text-gray-400">${complimentDate}</div>
                      </div>
                    </div>
                  `;
                }).join('')
          }}
        ></div>
        </div>
      </div>
    </div>

      <Menu />
    </div>
  )
}

export default HistoryPage