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
        <div className="mt-4">
          <TableRpuser />
        </div>
      </div>
    </NavBarUser>
  );
}
