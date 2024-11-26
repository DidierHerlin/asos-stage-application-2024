import React from 'react'
import Navbar from '../../../Navbar'
import FormeProfile from './FormeProfile'

export default function Profile() {
  return (
    <Navbar>
    <div className="flex">

    <div className="flex-grow p-4">
        <FormeProfile/>
    </div>
    </div>
</Navbar>
  )
}
