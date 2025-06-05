import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Loader from "../components/Loader";

export default function Dashboard() {
  const { user, logout, loading } = useContext(AuthContext);

  if (loading) return <Loader />;
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl mb-6">Welcome, {user.name}</h1>

      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
