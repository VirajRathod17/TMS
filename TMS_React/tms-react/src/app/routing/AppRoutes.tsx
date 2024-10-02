import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { Logout, AuthPage, useAuth } from '../modules/auth'
import { App } from '../App'
import { lazy, FC, Suspense } from 'react'
import { PrivateRoutes } from './PrivateRoutes'

const { PUBLIC_URL } = process.env

const AppRoutes: FC = () => {
  const token = localStorage.getItem('jwt_token');
  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='logout' element={<Logout />} />
          {token ? (
            <>
              {/* Render the private routes after login */}
              <Route path='/*' element={<PrivateRoutes />} />
              {/* Redirect to dashboard after login */}
              <Route index element={<Navigate to='/dashboard' />} />
            </>
           ) : ( 
            <>
              <Route path='login/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/login' />} />
            </>
           )} 
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export { AppRoutes }
