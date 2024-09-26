/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'

const DashboardPage: FC = () => (
  <>
    <h1>Hello</h1> {/* Add your content here */}
  </>
)

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
