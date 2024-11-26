import React from 'react'
import TableProjet from '../Tables/Projettab'
import Navbar from '../../../Navbar'

export default function TablesProjet() {
  return (
    <Navbar>
        <div className="flex">
    
        <div className="flex-grow p-4">
            <h2>Liste de projet</h2>
            <TableProjet />
        </div>
        </div>
    </Navbar>
  )
}
