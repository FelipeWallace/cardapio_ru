'use client'

import { useState, useEffect } from "react";
import AdminGuard from "@components/AdminGuard";

export default function AdicionarItemAoCardapio() {
    const [cardapios, setCardapios] = useState([]);
    const [itens, setItens] = useState([]);
    const [selectedCardapio, setSelectedCardapio] = useState("");
    const [selectedItems, setSelectedItems] = useState(new Set()); // Usar um Set para armazenar itens selecionados
    const [searchTerm, setSearchTerm] = useState("");
    const url = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(url + "cardapio")
            .then((response) => response.json())
            .then((data) => setCardapios(data))
            .catch((error) => console.error("Erro ao buscar cardápios:", error));

        fetch(url + "itens")
            .then((response) => response.json())
            .then((data) => setItens(data))
            .catch((error) => console.error("Erro ao buscar itens:", error));
    }, [url]);

    const filteredCardapios = cardapios.filter((cardapio) => {
        const dataFormatada = new Date(cardapio.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        return (
            dataFormatada.includes(searchTerm) ||
            cardapio.refeicao.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cardapio.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Filtro para excluir itens já presentes no cardápio
    // const itensFiltrados = cardapios.filter(item =>
    //     !itens.some(cardapioItem => cardapioItem.id === item.id)
    // );

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
            fetch(url + `cardapio/${selectedCardapio}/adicionar-item`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }), // Enviando cada item individualmente
            })
        );

        try {
            const responses = await Promise.all(promises);
            const messages = await Promise.all(responses.map(res => res.json()));

            // messages.forEach(message => {
            //     alert(message.message);
            // });
            // Resetando os estados após o envio
            setSelectedCardapio("");
            setSelectedItems(new Set());
        } catch (error) {
            console.error("Erro ao adicionar itens ao cardápio:", error);
        }
    };

    return (
        <AdminGuard>
            <form onSubmit={handleSubmit} className="container mx-auto p-4">
                <div>
                    <label htmlFor="cardapioSelect" className="block text-lg font-medium text-gray-700 mb-2">
                        Selecione um cardápio:
                    </label>
                    <input
                        type="text"
                        placeholder="Busque por data, título ou refeição"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <select
                        id="cardapioSelect"
                        value={selectedCardapio}
                        onChange={(e) => setSelectedCardapio(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
                    >
                        <option value="">Selecione um cardápio</option>
                        {filteredCardapios.map((cardapio) => (
                            <option key={cardapio.id} value={cardapio.id}>
                                {new Date(cardapio.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} - {cardapio.refeicao} - {cardapio.titulo}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                        Selecione um ou mais itens:
                    </label>
                    <div className="space-y-2">
                        {itens.map((item) => (
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
                    <p className="text-sm text-gray-500">Selecione múltiplos itens utilizando as caixas de seleção.</p>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                    Adicionar Itens ao Cardápio
                </button>
            </form>
        </AdminGuard>
    );
}
