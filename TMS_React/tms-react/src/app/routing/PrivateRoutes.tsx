import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import UpdateProfile from '../modules/auth/components/UpdateProfile'
import ChangePassword from '../modules/auth/components/ChangePassword'

const isTokenExpired = () => {
  const expirationTime = localStorage.getItem('jwt_expiration');
  return expirationTime ? new Date().getTime() > Number(expirationTime) : true;
};

const PrivateRoutes = () => {

  if (isTokenExpired()) {
    // Redirect to login if the token is expired
    return <Navigate to="/login" />
  }

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='login/*' element={<Navigate to='/dashboard' />} />
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='/profile' element={<UpdateProfile/>} />
        <Route path='/change-password' element={<ChangePassword/>} />

      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--kt-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
