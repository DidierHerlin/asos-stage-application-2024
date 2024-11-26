import React from 'react'
import NavBarUser from '../../NavBarUser';
import FormeAjoutRapports from './FormeAjoutRapports'
export default function AjoutRapport() {
  return (
    <NavBarUser>
        <div className="flex">
    
        <div className="flex-grow p-4">
            
        <div>Ajoute rapport</div>
        <FormeAjoutRapports/>
        </div>
        </div>
    </NavBarUser>
    
  )
}
