import React from 'react'
import Card from './composant/card';
import ChartBar from './composant/ChartBar';
import ChartDoughnut from './composant/ChartDoughnut';
import Navbar from './Navbar';
import CardUserAffiche from './composant/CardUserAffiche';
import TableDashboard from './composant/TableDashboard';
export default function Dashbord() {
  return (
      <Navbar>

      <div>
          <div>
          <Card/>
          </div>
        
          <div className="flex max-md:flex-col w-full mt-8 ">
              <ChartBar />
              <ChartDoughnut />
          </div>
          <div className="w-full mt-8">
          <TableDashboard />
        </div>

       </div>
      </Navbar>
    
  )
}
