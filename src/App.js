import React, { useState } from 'react';
import Facturas from './Facturas';
import NotasDeCredito from './NotasDeCreditos';

const App = () => {
  const [selectedFactura, setSelectedFactura] = useState(null);

  const resetAsignacion = () => {
    setSelectedFactura(null);
  };

  return (
    <div className="container mx-auto p-4">
      <Facturas setSelectedFactura={setSelectedFactura} />
      {selectedFactura && (
        <NotasDeCredito
          facturaId={selectedFactura.id}
          resetAsignacion={resetAsignacion}
        />
      )}
    </div>
  );
};

export default App;
