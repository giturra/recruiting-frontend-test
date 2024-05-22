import React from 'react';

const ModalExito = ({ show, handleClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <span className="text-green-500 text-4xl">✔️</span>
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">Nota de crédito asignada correctamente</h2>
        <div className="flex items-center justify-center">
          <button
            onClick={handleClose}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Seguir asignando
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalExito;
