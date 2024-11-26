import React from 'react'
import NavBarUser from '../../../NavBarUser'
import FormeProfile from './FormeProfile'

export default function EmployerProile() {
  return (
    <NavBarUser>
    <div className="flex">

    <div className="flex-grow p-4">
        <FormeProfile/>
    </div>
    </div>
    </NavBarUser>
  )
}
