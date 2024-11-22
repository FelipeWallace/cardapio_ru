'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Notification from './Notification';

const RemoveItemModal = ({ cardapioId, onClose }) => {
    const [itens, setItens] = useState([]);
    const [filtroNome, setFiltroNome] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const url = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (cardapioId) {
            fetch(url + `cardapio/${cardapioId}/itens`)
                .then((response) => response.json())
                .then((data) => setItens(data))
                .catch((error) => console.error("Erro ao buscar itens do cardápio:", error));
        }
    }, [cardapioId]);

    const handleRemoveItem = (itemId) => {
        fetch(url + `cardapio/${cardapioId}/remover-item/${itemId}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                setSuccessMessage(data.message);
                setItens(itens.filter((item) => item.id !== itemId));
            })
            .catch((error) => setErrorMessage("Erro ao remover item do cardápio:", error));

    };

    const itensFiltrados = itens.filter((item) => {
        return item.nome.toLowerCase().includes(filtroNome.toLowerCase());
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

            <Notification message={successMessage} type="success" clearMessage={() => setSuccessMessage('')} />
            <Notification message={errorMessage} type="error" clearMessage={() => setErrorMessage('')} />

            <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4">Remover Itens do Cardápio</h2>
                
                <div className="mb-4">
                    <input
                        placeholder="Filtrar por nome do item"
                        type="text"
                        value={filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                    />
                </div>

                {itensFiltrados.length > 0 ? (
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {itensFiltrados.map((item) => (
                            <li key={item.id} className="flex items-center justify-between border-b border-gray-300 pb-2 mb-2">
                                <span>
                                    <strong>{item.nome}</strong>
                                </span>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-red-500 hover:text-red-700 transition duration-300"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhum item encontrado neste cardápio.</p>
                )}

                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RemoveItemModal;
