import React, { useState, useEffect } from 'react';
import ModalExito from './ModalExito';

/**
 * Componente para mostrar y seleccionar notas de crédito asociadas a una factura específica.
 *
 * @component
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.facturaId - El ID de la factura para la cual se buscan las notas de crédito.
 * @param {function} props.resetAsignacion - Función para resetear la asignación de la nota de crédito.
 * @returns {React.ReactElement} El componente de notas de crédito.
 */
const NotasDeCredito = ({ facturaId, facturaValor, resetAsignacion }) => {

  /**
   * Estado para almacenar la lista de notas de crédito.
   * @type {Array<Object>}
   */
  const [notasDeCredito, setNotasDeCredito] = useState([]);

  /**
   * Estado para almacenar la nota de crédito seleccionada.
   * @type {Object|null}
   */
  const [selectedNota, setSelectedNota] = useState(null);

  /**
   * Estado para controlar la visibilidad del modal de éxito.
   * @type {boolean}
   */
  const [showModal, setShowModal] = useState(false);    

  useEffect(() => {
    /**
     * Función para obtener las notas de crédito desde la API.
     * @async
     * @function fetchNotasDeCredito
     * @returns {Promise<void>}
     */
    const fetchNotasDeCredito = async () => {
      try {
        const response = await fetch('https://recruiting.api.bemmbo.com/invoices/pending');
        if (!response.ok) {
          throw new Error('Error al obtener las notas de crédito');
        }
        const data = await response.json();
        const filteredNotas = data.filter(invoice => invoice.type === 'credit_note').filter(invoice => invoice.reference === facturaId);

        filteredNotas.forEach(nota => {
          if (nota.currency === "CLP") {
            nota.usdAmount = nota.amount * 0.0013;
          } else if (nota.currency === "USD") {
            nota.currency = "CLP";
            nota.usdAmount = nota.amount;
            nota.amount = Math.ceil(nota.usdAmount / 0.0013);
          }
          
          nota.montoFactura = facturaValor
          nota.montofacturaUSD = Math.ceil(nota.montoFactura * 0.0013)
          nota.facturaValue = nota.montoFactura - nota.amount
          nota.facturaValueUSD = Math.ceil(nota.facturaValue * 0.0013)

        });

        setNotasDeCredito(filteredNotas);
      } catch (error) {
        console.error('Error al obtener las notas de crédito:', error);
      }
    };

    if (facturaId) {
      fetchNotasDeCredito();
    }
  }, [facturaId, facturaValor]);

  /**
   * Maneja la asignación de la nota de crédito seleccionada.
   * @function handleAsignar
   */
  const handleAsignar = () => {
    if (selectedNota) {
      setShowModal(true);
    }
  };

  /**
   * Maneja el cierre del modal de éxito.
   * @function handleCloseModal
   */
  const handleCloseModal = () => {
    setShowModal(false);
    resetAsignacion();
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4 center">Selecciona una nota de crédito {facturaValor}</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Nota de Crédito</th>
            <th className="px-4 py-2 text-left">Monto</th>
            <th className="px-4 py-2 text-left">Factura</th>
          </tr>
        </thead>
        <tbody>
          {notasDeCredito.map((nota) => (
            <tr key={nota.id} className={`border-b ${selectedNota && selectedNota.id === nota.id ? 'bg-blue-200' : ''}`}>
              <td className="px-4 py-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="nota"
                    value={nota.id}
                    onChange={() => setSelectedNota(nota)}
                    className="mr-2"
                  />
                  <strong>{nota.id}</strong> ({nota.organization_id})
                </label>
              </td>
              <td className="px-4 py-2 text-left">
                <strong>{nota.amount} {nota.currency}</strong> (${nota.usdAmount} USD)
              </td>
              <td className="px-4 py-2 text-left">
                {facturaId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedNota && (
        <div className="mt-8">
          <div className="flex items-center justify-center">
            <button
              onClick={handleAsignar}
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Asignar
            </button>
          </div>
        </div>
      )}
      <ModalExito show={showModal} handleClose={handleCloseModal} nota={selectedNota} facturaId={facturaId}/>
    </div>
  );
};

export default NotasDeCredito;