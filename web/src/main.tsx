import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Login from './routes/Login'
import Admin from './routes/Admin'
import Portal from './routes/Portal'

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/admin', element: <Admin /> },
  { path: '/portal/:projectId', element: <Portal /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
