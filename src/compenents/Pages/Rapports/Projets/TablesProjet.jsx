import React from 'react'
import TableProjet from '../Tables/Projettab'
import Navbar from '../../../Navbar'

export default function TablesProjet() {
  return (
    <Navbar>
        <div className="flex">
    
        <div className="flex-grow p-4">
        <p className='ml-5 text-lg'>Liste de projet</p>

            <TableProjet />
        </div>
        </div>
    </Navbar>
  )
}
