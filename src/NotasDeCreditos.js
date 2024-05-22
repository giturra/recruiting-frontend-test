import React, { useState, useEffect } from 'react';
import ModalExito from './ModalExito';

const NotasDeCredito = ({ facturaId, resetAsignacion }) => {

  const [notasDeCredito, setNotasDeCredito] = useState([]);
  const [selectedNota, setSelectedNota] = useState(null);
  const [showModal, setShowModal] = useState(false);    

  useEffect(() => {
    const fetchNotasDeCredito = async () => {
      try {
        const response = await fetch('https://recruiting.api.bemmbo.com/invoices/pending');
        if (!response.ok) {
          throw new Error('Error al obtener las notas de crédito');
        }
        const data = await response.json();
        const filteredNotas = data.filter(invoice => invoice.type === 'credit_note').filter(invoice => invoice.reference === facturaId);

        filteredNotas.forEach(factura => {
          
            if (factura.type === 'received') {
              factura.type = "Recibida"; // Cambiar la edad de Ana a 26
            }
  
            if (factura.currency === "CLP") {
                factura.usdAmount = factura.amount * 0.0013;
            }
            else if (factura.currency === "USD") {
              factura.currency = "CLP";
              factura.usdAmount  = factura.amount;
              factura.amount = Math.ceil(factura.usdAmount / 0.0013)
     
            } 
        });

        setNotasDeCredito(filteredNotas);
      } catch (error) {
        console.error('Error al obtener las notas de crédito:', error);
      }
    };

    if (facturaId) {
      fetchNotasDeCredito();
    }
  }, [facturaId]);

  const handleAsignar = () => {
    if (selectedNota) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetAsignacion();
  };


  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Selecciona una nota de crédito</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
          <th></th>
            <th className="px-4 py-2 text-left">Nota de Crédito</th>
            <th className="px-4 py-2 text-right">Monto</th>
          </tr>
        </thead>
        <tbody>
          {notasDeCredito.map((nota) => (
            <tr key={nota.id} className="border-b">
              <td className="px-4 py-2">
                  <input
                    type="radio"
                    name="factura"
                    value={nota.id}
                    onChange={() => setSelectedNota(nota)}
                    className="mr-2"
                  />
              </td>
              <td className="px-4 py-2">{nota.id} ({nota.organization_id})</td>
              <td className="px-4 py-2 text-right"><strong>{nota.amount} {nota.currency}</strong> (${nota.usdAmount} USD)</td>
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
      <ModalExito show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default NotasDeCredito;
