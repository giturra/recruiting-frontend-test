import React, { useState, useEffect } from 'react';

/**
 * Componente para mostrar y seleccionar facturas pendientes.
 *
 * @component
 * @param {Object} props - Las propiedades del componente.
 * @param {function} props.setSelectedFactura - Función para establecer la factura seleccionada.
 * @returns {React.ReactElement} El componente de facturas.
 */
const Facturas = ({ setSelectedFactura }) => {
  /**
   * Estado para almacenar la lista de facturas.
   * @type {Array<Object>}
   */
  const [facturas, setFacturas] = useState([]);

  /**
   * Estado para almacenar el ID de la factura seleccionada.
   * @type {string|null}
   */
  const [selectedFacturaId, setSelectedFacturaId] = useState(null);

  /**
   * Estado para almacenar el valor de la factura seleccionada.
   * @type {Number|null}
   */
    const [selectedFacturaValor, setSelectedFacturaValor] = useState(0);

  useEffect(() => {
    /**
     * Función para obtener las facturas pendientes desde la API.
     * @async
     * @function fetchFacturas
     * @returns {Promise<void>}
     */
    const fetchFacturas = async () => {
      try {
        const response = await fetch('https://recruiting.api.bemmbo.com/invoices/pending');
        if (!response.ok) {
          throw new Error('Error al obtener las facturas');
        }
        const data = await response.json();
        const filterData = data.filter(factura => factura.type === 'received');
        filterData.forEach(factura => {
          if (factura.type === 'received') {
            factura.type = "Recibida";
          }
          if (factura.currency === "CLP") {
            factura.usdAmount = factura.amount * 0.0013;
          } else if (factura.currency === "USD") {
            factura.currency = "CLP";
            factura.usdAmount = factura.amount;
            factura.amount = Math.ceil(factura.usdAmount / 0.0013);
          }
        });
        setFacturas(filterData);
      } catch (error) {
        console.error('Error al obtener las facturas:', error);
      }
    };

    fetchFacturas();
  }, []);

  /**
   * Maneja la selección de una factura.
   * @function handleSelectFactura
   * @param {Object} factura - La factura seleccionada.
   */
  const handleSelectFactura = (factura) => {
    setSelectedFactura(factura);
    setSelectedFacturaId(factura.id);
    setSelectedFacturaValor(factura.amount);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Selecciona una factura</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Factura</th>
            <th className="px-4 py-2 text-right">Monto</th>
            <th className="px-4 py-2 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {facturas.map((factura) => (
            <tr key={factura.id} className={`border-b ${selectedFacturaId === factura.id ? 'bg-blue-100' : ''}`}>
              <td className="px-4 py-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="factura"
                    value={factura.id}
                    onChange={() => handleSelectFactura(factura)}
                    className="mr-2"
                  />
                  <strong>{factura.id}</strong> ({factura.organization_id})
                </label>
              </td>
              <td className="px-4 py-2 text-right">
                <strong>{factura.amount} {factura.currency}</strong> (${factura.usdAmount} USD)
              </td>
              <td className="px-4 py-2">{factura.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Facturas;