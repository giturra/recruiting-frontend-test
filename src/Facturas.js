import React, { useState, useEffect } from 'react';

const Facturas = ({ setSelectedFactura }) => {
  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const response = await fetch('https://recruiting.api.bemmbo.com/invoices/pending');
        if (!response.ok) {
          throw new Error('Error al obtener las facturas');
        }
        const data = await response.json();
        const filterData = data.filter(factura => factura.type === 'received')
        filterData.forEach(factura => {
          
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
        setFacturas(filterData);
      } catch (error) {
        console.error('Error al obtener las facturas:', error);
      }
    };

    fetchFacturas();
  }, []);

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
            <tr key={factura.id} className="border-b">
              <td className="px-4 py-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="factura"
                    value={factura.id}
                    onChange={() => setSelectedFactura(factura)}
                    className="mr-2"
                  />
                  {factura.id} ({factura.organization_id})
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
