import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Layout from './Layout';
import Loader from './Loader';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <Loader />
  if (!user) return <Navigate to="/login" replace />

  return (
    <Layout>{ children }</Layout>
  )
}
