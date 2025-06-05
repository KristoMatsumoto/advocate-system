import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import LoginPage from './pages/LoginPage'
import CasesPage from './pages/CasesPage';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2c539c',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />      
          <Route path="/cases" element={<ProtectedRoute><CasesPage /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
