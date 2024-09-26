import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import { Logout, AuthPage, useAuth } from '../modules/auth'
import { App } from '../App'
import { lazy, FC, Suspense } from 'react'
import { PrivateRoutes } from './PrivateRoutes'

const { PUBLIC_URL } = process.env

const AppRoutes: FC = () => {
  const { currentUser } = useAuth()
  
  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='logout' element={<Logout />} />
          
          {currentUser ? (
            <>
              {/* Render the private routes after login */}
              <Route path='/*' element={<PrivateRoutes />} />
              {/* Redirect to dashboard after login */}
              <Route index element={<Navigate to='/dashboard' />} />
            </>
          ) : (
            <>
              {/* Change the path to '/login' instead of '/auth' */}
              <Route path='login/*' element={<AuthPage />} />
              {/* Redirect all unknown paths to '/login' */}
              <Route path='*' element={<Navigate to='/login' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export { AppRoutes }
