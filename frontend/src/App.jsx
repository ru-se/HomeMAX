import React from "react"
import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./contexts/AuthContext"
import { TasksProvider } from "./contexts/TasksContext"
import { HistoryProvider } from "./contexts/HistoryContext"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TasksProvider>
          <HistoryProvider>
            <AppRoutes />
          </HistoryProvider>
        </TasksProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App