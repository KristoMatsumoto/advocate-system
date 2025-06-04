import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import CasesPage from './pages/CasesPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />      
        <Route path="/cases" element={<ProtectedRoute><CasesPage /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  )
}

export default App
