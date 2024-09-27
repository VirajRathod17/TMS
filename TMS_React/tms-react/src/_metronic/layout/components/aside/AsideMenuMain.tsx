/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
import {KTSVG} from '../../../helpers'
import {AsideMenuItem} from './AsideMenuItem'

export function AsideMenuMain() {
  const intl = useIntl()

  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title='Dashboard'
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/award'
        icon='/media/icons/duotune/art/art002.svg'
        title='Award'
        fontIcon='bi-app-indicator'
      />
    </>
  )
}
