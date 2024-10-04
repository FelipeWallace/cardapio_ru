'use client'

import { useState, useEffect } from "react";
import AdminGuard from "@components/AdminGuard";

export default function AdicionarItemAoCardapio() {
    const [cardapios, setCardapios] = useState([]);
    const [itens, setItens] = useState([]);
    const [selectedCardapio, setSelectedCardapio] = useState("");
    const [selectedItem, setSelectedItem] = useState("");

    const url = "http://localhost:9081/";

    useEffect(() => {
        fetch(url + "cardapio")
            .then((response) => response.json())
            .then((data) => setCardapios(data))
            .catch((error) => console.error("Erro ao buscar cardápios:", error));

        fetch(url + "itens")
            .then((response) => response.json())
            .then((data) => setItens(data))
            .catch((error) => console.error("Erro ao buscar itens:", error));
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch(url + `cardapio/${selectedCardapio}/adicionar-item`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ itemId: selectedItem }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message);
                setSelectedCardapio("");
                setSelectedItem("");
            })
            .catch((error) => console.error("Erro ao adicionar item ao cardápio:", error));
    };

    return (
        <AdminGuard>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="cardapioSelect" className="block text-lg font-medium text-gray-700 mb-2">
                        Selecione um cardápio:
                    </label>
                    <select
                        id="cardapioSelect"
                        value={selectedCardapio}
                        onChange={(e) => setSelectedCardapio(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 mb-4"
                    >
                        <option value="">Selecione um cardápio</option>
                        {cardapios.map((cardapio) => (
                            <option key={cardapio.id} value={cardapio.id}>
                                {new Date(cardapio.data).toLocaleDateString('pt-BR')} - {cardapio.refeicao} - {cardapio.titulo}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="itemSelect" className="block text-lg font-medium text-gray-700 mb-2">
                        Selecione um item:
                    </label>
                    <select
                        id="itemSelect"
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 mb-4"
                    >
                        <option value="">Selecione um item</option>
                        {itens.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Adicionar Item ao Cardápio
                </button>
            </form>
        </AdminGuard>
    );
}
