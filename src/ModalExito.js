import React from 'react';

/**
 * Componente ModalExito para mostrar un modal de éxito.
 *
 * @component
 * @param {Object} props - Las propiedades del componente.
 * @param {boolean} props.show - Indica si el modal debe mostrarse.
 * @param {function} props.handleClose - Función para cerrar el modal.
 * @returns {React.ReactElement|null} El componente del modal o null si no se debe mostrar.
 */
const ModalExito = ({ show, handleClose, nota, facturaId }) => {
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
        {nota && (
          <div className="text-center mb-4">
            <p>ID del crédito: {nota.id}</p>
            <p>Monto del crédito: <strong>{nota.amount} {nota.currency}</strong> (${nota.usdAmount} USD)</p>
            <p>Monto de la factura: <strong>{nota.montoFactura}</strong> CLP (${nota.montofacturaUSD} USD)</p>
            <p>Nuevo monto de la factura: <strong>{nota.facturaValue} CLP</strong> (${nota.facturaValueUSD} USD)</p>
          </div>
        )}
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