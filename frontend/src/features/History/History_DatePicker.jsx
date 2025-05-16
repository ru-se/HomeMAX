import DatePicker from "react-datepicker"
import React, { useState } from 'react'

import "react-datepicker/dist/react-datepicker.css"

const History_DatePicker = () => {
    const initialDate = new Date()
    const [startDate, setStartDate] = useState(initialDate)
    const handleChange = (date) => {
      setStartDate(date)
    }
  
    return (
<div className="date-picker">
      <label htmlFor="date">日付を選択:</label>
      {/* <input type="text" value={startDate.toLocaleDateString()} readOnly /> */}

      <DatePicker
        selected={startDate}
        onChange={handleChange}
        id="date"
        dateFormat="yyyy/MM/dd"
      />
    </div>    )
  }
  
  export default History_DatePicker