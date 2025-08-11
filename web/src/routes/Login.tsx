import { useEffect, useState } from 'react'
import { auth, signInWithEmailAndPassword, onAuthStateChanged } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u) nav('/admin')
    })
  }, [])

  const doLogin = async (e: any) => {
    e.preventDefault()
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      nav('/admin')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6">Adhere CRM – Admin Login</h1>
        <form onSubmit={doLogin} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input w-full" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@adherestudio.com" />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button className="btn w-full" type="submit">Sign in</button>
        </form>
      </div>
    </div>
  )
}
