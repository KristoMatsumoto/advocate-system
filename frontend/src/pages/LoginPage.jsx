import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import AuthForm from '../components/AuthForm'
import Loader from "../components/Loader";

export default function LoginPage() {
  const { login, loading } = useContext(AuthContext)
  
  if (loading) return <Loader />;
  return <AuthForm onAuthSuccess={login} />
}
