import React from 'react';
import CardUser from './composant/CardUser';
import NavBarUser from './NavBarUser';
import TableRpuser from './TableRpuser';


export default function Dashbord() {
  return (
    <NavBarUser>
      <div className="flex flex-col gap-6 p-4">
        <div>
          <CardUser />
        </div>
        {/* Ajout d'un margin-top avec Tailwind CSS */}
        <div className="flex flex-wrap max-md:flex-col w-full mt-2 gap-6">
          <div className="flex-grow basis-2/3 max-md:basis-full">
            <TableRpuser />
          </div>
          
        </div>

      </div>
    </NavBarUser>
  );
}
