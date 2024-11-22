'use client';

import { useState, useEffect } from 'react';
import Notification from './Notification';

const AddItemModal = ({ cardapioId, onClose }) => {
    const [itens, setItens] = useState([]);  // Todos os itens disponíveis
    const [itensNoCardapio, setItensNoCardapio] = useState([]);  // Itens já no cardápio
    const [selectedItems, setSelectedItems] = useState(new Set());  // Itens selecionados
    const [filtroNome, setFiltroNome] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const url = process.env.NEXT_PUBLIC_API_URL;

    // Busca todos os itens disponíveis
    useEffect(() => {
        fetch(url + "itens")
            .then((response) => response.json())
            .then((data) => setItens(data))
            .catch((error) => console.error("Erro ao buscar itens:", error));
    }, []);

    // Busca os itens já presentes no cardápio atual
    useEffect(() => {
        if (cardapioId) {
            fetch(url + `cardapio/${cardapioId}/itens`)
                .then((response) => response.json())
                .then((data) => setItensNoCardapio(data))
                .catch((error) => console.error("Erro ao buscar itens do cardápio:", error));
        }
    }, [cardapioId]);

    const itensFiltrados = itens
    .filter(item =>
        !itensNoCardapio.some(cardapioItem => cardapioItem.id === item.id)
    )
    .filter(item => 
        filtroNome ? item.nome.toLowerCase().includes(filtroNome.toLowerCase()) : true
    );

    // Controle de seleção de itens
    const handleCheckboxChange = (itemId) => {
        const updatedSelection = new Set(selectedItems);
        if (updatedSelection.has(itemId)) {
            updatedSelection.delete(itemId); // Remove o item se já estiver selecionado
        } else {
            updatedSelection.add(itemId); // Adiciona o item se não estiver selecionado
        }
        setSelectedItems(updatedSelection);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const promises = Array.from(selectedItems).map(itemId =>
            fetch(url + `cardapio/${cardapioId}/adicionar-item`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }), // Enviando cada item individualmente
            })
        );

        try {
            await Promise.all(promises);
            setSuccessMessage("Itens adicionados com sucesso!");
            setSelectedItems(new Set());
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (error) {
            setErrorMessage("Erro ao adicionar itens ao cardápio:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Notification message={errorMessage} type="error" clearMessage={() => setErrorMessage('')} />
            <Notification message={successMessage} type="success" clearMessage={() => setSuccessMessage('')} />
            <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4">Adicionar Itens ao Cardápio</h2>

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
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {itensFiltrados.map(item => (
                                <div key={item.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`item-${item.id}`}
                                        value={item.id}
                                        checked={selectedItems.has(item.id)}
                                        onChange={() => handleCheckboxChange(item.id)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`item-${item.id}`} className="text-gray-800">
                                        {item.nome}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Adicionar Itens
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mt-4 flex justify-end space-x-2">
                        <p>Não há itens disponíveis para adicionar a este cardápio.</p>
                        <button
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Cancelar
                        </button>
                    </div>

                )}
            </div>
        </div>
    );
};

export default AddItemModal;
