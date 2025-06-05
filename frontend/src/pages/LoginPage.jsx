import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import AuthForm from '../components/AuthForm'

export default function LoginPage() {
  const { login } = useContext(AuthContext)
  
  return (
    <AuthForm onAuthSuccess={login} />
  )
}
