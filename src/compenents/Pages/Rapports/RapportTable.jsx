import React from 'react';
import Navbar from '../../Navbar'; // Assurez-vous que le chemin d'importation est correct
import AffichageRapport from './Tables/ExampleWithProviders'; // Ajustez le chemin d'importation si nécessaire

export default function RapportTable() {
  return (
    <Navbar>
         <div className="flex">
      
            <div className="flex-grow p-4">
                <h2>Liste de Rapports</h2>
                <AffichageRapport />
            </div>
            </div>
    </Navbar>
   
  );
}
