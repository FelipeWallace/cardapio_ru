import React from "react";

const AvisoPopup = ({ aviso, onClose }) => {
  if (!aviso) return null; // Retorna null se não houver aviso

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-bold mb-2">{aviso.aviso}</h2>
        <p className="text-gray-600 mb-4">Tipo: {aviso.tipo}</p>
        <p className="text-gray-400 mb-2">Data: {aviso.data}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default AvisoPopup;
