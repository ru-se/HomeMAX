import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default styles
import './CalendarComponent.css'; // Custom styles

const CalendarComponent = ({ history, selectedDate, onDateChange }) => {
    // 日記がある日付をSetで保持（高速化のため）
    const historyDates = new Set(history.map(item =>
        new Date(item.letter_date).toDateString()
    ));

    const tileContent = ({ date, view }) => {
        if (view === 'month' && historyDates.has(date.toDateString())) {
            return (
                <div className="flex justify-center mt-1">
                    <div className="w-2 h-2 bg-[#db2777] rounded-full"></div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-sm border-2 border-dashed border-[#fbcfe8]">
            <h2 className="text-xl font-bold text-[#db2777] mb-4 text-center flex items-center justify-center gap-2">
                <span>📅</span> カレンダー
            </h2>
            <div className="custom-calendar-container">
                <Calendar
                    onChange={onDateChange}
                    value={selectedDate}
                    locale="ja-JP"
                    tileContent={tileContent}
                    className="w-full border-none font-kiwi-maru"
                    prev2Label={null}
                    next2Label={null}
                />
            </div>
            <div className="mt-4 text-center">
                <button
                    onClick={() => onDateChange(null)}
                    className="text-sm text-gray-500 hover:text-[#db2777] underline transition-colors"
                >
                    日付選択を解除
                </button>
            </div>
        </div>
    );
};

export default CalendarComponent;
