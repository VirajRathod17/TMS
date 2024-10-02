import {lazy, FC, Suspense} from 'react'
import {Route, Routes, Navigate} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import { dynamicRoutes } from './dynamicRoutes';



const PrivateRoutes = () => {
  const Index = lazy(() => import('../modules/award-category/components/index'));

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