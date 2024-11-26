// src/components/UserTables.js
import React from 'react';
import Navbar from '../../Navbar';
import TableUser from '../../Pages/Rapports/Tables/TableUser';
import { useTranslation } from 'react-i18next';

const UserTables = () => {
    console.log('Rendering UserTables');
    const {t} = useTranslation();
    return (
      <Navbar>
        <div className="flex flex-grow p-4">
          <div className="flex-grow">
            <h2 className="text-2xl font-bold mb-4">{t('liste-des-employes')}</h2>
            {/* Remplacez temporairement TableUser par un simple message */}
                <TableUser/>
          </div>
        </div>
      </Navbar>
    );
  };
  

export default UserTables;
