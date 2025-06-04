import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl mb-6">Welcome, {user.name}</h1>

      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      <button
        onClick={() => { navigate("/cases"); }}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Cases
      </button>
    </div>
  );
}
