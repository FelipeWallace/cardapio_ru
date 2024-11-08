'use client'

import { useState, useEffect } from "react";
import AdminGuard from "@components/AdminGuard";

export default function RemoverItemDoCardapio() {
    const [cardapios, setCardapios] = useState([]);
    const [selectedCardapioId, setSelectedCardapioId] = useState("");
    const [itens, setItens] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const url = process.env.NEXT_PUBLIC_API_URL;

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

    const filteredCardapios = cardapios.filter((cardapio) => {
        const dataFormatada = new Date(cardapio.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        return (
            dataFormatada.includes(searchTerm) ||
            cardapio.refeicao.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cardapio.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

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
        <AdminGuard>
            <div className="container mx-auto p-4">
                <h2 className="text-xl font-bold mb-4">Selecionar Cardápio</h2>

                <input
                    type="text"
                    placeholder="Busque por data, título ou refeição"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2 p-2 border border-gray-300 rounded w-full"
                />

                <select
                    value={selectedCardapioId}
                    onChange={(e) => setSelectedCardapioId(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded w-full"
                >
                    <option value="">Selecione um cardápio</option>
                    {filteredCardapios.map((cardapio) => (
                        <option key={cardapio.id} value={cardapio.id}>
                            {new Date(cardapio.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} - {cardapio.refeicao} - {cardapio.titulo}
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
        </AdminGuard>
    );
}
