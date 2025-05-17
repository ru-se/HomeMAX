import DatePicker from "react-datepicker"
import React from 'react'
import "react-datepicker/dist/react-datepicker.css"

const History_DatePicker = ({ selectedDate, setSelectedDate }) => {
  const handleChange = (date) => {
    setSelectedDate(date)
  }

  return (
    <div className="date-picker">
      <label htmlFor="date">日付を選択:</label>
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        id="date"
        dateFormat="yyyy/MM/dd"
      />
    </div>
  )
}

export default History_DatePicker