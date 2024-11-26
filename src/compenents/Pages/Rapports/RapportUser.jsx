import React from 'react';
import NavBarUser from '../../NavBarUser'; // Assurez-vous que le chemin d'importation est correct
import TableRapportUser from './Tables/TableRapportUser';
export default function RapportUser() {
  return (
    <NavBarUser>
         <div className="flex">
      
            <div className="flex-grow p-4">
                
                <TableRapportUser/>
            </div>
            </div>
    </NavBarUser>
   
  );
}
