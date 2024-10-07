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
        to='/awards'
        icon='/media/icons/duotune/art/art002.svg'
        title='Award'
        />
      <AsideMenuItem
        to='/award-category'
        icon='/media/icons/duotune/art/art002.svg'
        title='Award Category'
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/media-partner'
        icon='/media/icons/duotune/art/art002.svg'
        title='Media Partner'
        fontIcon='bi-app-indicator'
      />
    </>
  )
}
