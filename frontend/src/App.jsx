import React, { useState } from "react"
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { TasksProvider } from "./contexts/TasksContext"

export const HistoryContext = React.createContext();

function App() {
  const [history, setHistory] = useState([]);

  return (
    <BrowserRouter>
      <TasksProvider>
        <HistoryContext.Provider value={{ history, setHistory }}>
          <AppRoutes />
        </HistoryContext.Provider>
      </TasksProvider>
    </BrowserRouter>
  )
}

export default App