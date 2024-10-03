import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import { dynamicRoutes } from './dynamicRoutes';
// import Create from '../modules/awards/components/create'

import UpdateProfile from '../modules/auth/components/UpdateProfile'

const isTokenExpired = () => {
  const expirationTime = localStorage.getItem('jwt_expiration');
  return expirationTime ? new Date().getTime() > Number(expirationTime) : true;
};

const PrivateRoutes = () => {
  const Award_Index = lazy(() => import('../modules/awards/components/index'))
  const Award_Categories_Index = lazy(() => import('../modules/award-category/components/index'));

  if (isTokenExpired()) {
    // Redirect to login if the token is expired
    return <Navigate to="/login" />
  }

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* {/ Redirect to Dashboard after success login/registartion /} */}
        <Route path='login/*' element={<Navigate to='/dashboard' />} />
        <Route path='dashboard' element={<DashboardWrapper />} />
        {dynamicRoutes.map(({ path, component: Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <SuspensedView>
                <Component />
              </SuspensedView>
            }
          />
        ))}
        <Route path='/profile' element={<UpdateProfile/>} />
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