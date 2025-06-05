import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false);
    navigate('/login');
  }

  const login = (token, user) => {
    localStorage.setItem('token', token);
    setUser(user);
    setLoading(false);
    navigate("/");
  }

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      logout();
      return;
    }

    api.get('/current_user', { headers: { Authorization: `Bearer ${token}`, }, })
      .then(res => {
        setUser(res.data.user);
        setLoading(false);
      })
    .catch((error) => { console.error("Failed to fetch current user:", error); logout(); })
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, logout, login, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
