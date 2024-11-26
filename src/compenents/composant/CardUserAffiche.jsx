import React from 'react';
import ChartUser from './ChartUser';

export default function CardUserAffiche() {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2">Employer</h2>
        <ChartUser />
      </div>
    </div>
  );
}
