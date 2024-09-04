'use client'

import React, { useState, useEffect } from "react";

export default function RemoverItemDoCardapio() {
    const [cardapios, setCardapios] = useState([]);
    const [selectedCardapioId, setSelectedCardapioId] = useState("");
    const [itens, setItens] = useState([]);

    const url = "http://localhost:9081/";

    useEffect(() => {
        fetch(url + "cardapio")
            .then((response) => response.json())
            .then((data) => setCardapios(data))
            .catch((error) => console.error("Erro ao buscar cardápios:", error));
    }, []);

    useEffect(() => {
        if (selectedCardapioId) {
            fetch(url + `cardapio/${selectedCardapioId}/itens`)
                .then((response) => response.json())
                .then((data) => setItens(data))
                .catch((error) => console.error("Erro ao buscar itens do cardápio:", error));
        }
    }, [selectedCardapioId]);

    const handleRemoveItem = (itemId) => {
        fetch(url + `cardapio/${selectedCardapioId}/remover-item/${itemId}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message);
                setItens(itens.filter((item) => item.id !== itemId));
            })
            .catch((error) => console.error("Erro ao remover item do cardápio:", error));
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Selecionar Cardápio</h2>
            <select
                value={selectedCardapioId}
                onChange={(e) => setSelectedCardapioId(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded"
            >
                <option value="">Selecione um cardápio</option>
                {cardapios.map((cardapio) => (
                    <option key={cardapio.id} value={cardapio.id}>
                        {new Date(cardapio.data).toLocaleDateString('pt-BR')} - {cardapio.refeicao} - {cardapio.titulo}
                    </option>
                ))}
            </select>

            {selectedCardapioId && itens.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold mb-4">Itens do Cardápio</h3>
                    <ul>
                        {itens.map((item) => (
                            <li key={item.id} className="mb-2 flex items-center justify-between">
                                <span>
                                    <strong>{item.nome}</strong>: {item.descricao}
                                </span>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Remover
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedCardapioId && itens.length === 0 && (
                <p>Nenhum item encontrado neste cardápio.</p>
            )}
        </div>
    );
}
