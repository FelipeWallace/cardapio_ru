'use client';

import { useState, useEffect } from "react";
import AdminGuard from "@components/AdminGuard";
import Notification from "@components/Notification";

export default function AdicionarItemAoCardapio() {
    const [cardapios, setCardapios] = useState([]);
    const [itens, setItens] = useState([]);
    const [itensNoCardapio, setItensNoCardapio] = useState([]);
    const [selectedCardapio, setSelectedCardapio] = useState("");
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroNome, setFiltroNome] = useState('');
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
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

    // Busca os itens já presentes no cardápio selecionado
    useEffect(() => {
        if (!selectedCardapio) {
            setItensNoCardapio([]);
            return;
        }

        fetch(url + `cardapio/${selectedCardapio}/itens`)
            .then((response) => response.json())
            .then((data) => setItensNoCardapio(data))
            .catch((error) => console.error("Erro ao buscar itens do cardápio:", error));
    }, [selectedCardapio, url]);

    const filteredCardapios = cardapios.filter((cardapio) => {
        const dataFormatada = new Date(cardapio.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        return (
            dataFormatada.includes(searchTerm) ||
            cardapio.refeicao.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cardapio.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const itensFiltrados = itens.filter(
        (item) =>
            !itensNoCardapio.some((cardapioItem) => cardapioItem.id === item.id) &&
            (filtroNome ? item.nome.toLowerCase().includes(filtroNome.toLowerCase()) : true)
    );

    const handleCheckboxChange = (itemId) => {
        const updatedSelection = new Set(selectedItems);
        if (updatedSelection.has(itemId)) {
            updatedSelection.delete(itemId);
        } else {
            updatedSelection.add(itemId);
        }
        setSelectedItems(updatedSelection);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const promises = Array.from(selectedItems).map((itemId) =>
            fetch(url + `cardapio/${selectedCardapio}/adicionar-item`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId }),
            })
        );

        try {
            await Promise.all(promises);
            setSuccessMessage("Itens adicionados com sucesso!");
            setSelectedCardapio("");
            setSelectedItems(new Set());
        } catch (error) {
            console.error("Erro ao adicionar itens ao cardápio:", error);
            setErrorMessage("Erro ao adicionar itens ao cardápio.");
        }
    };

    return (
        <AdminGuard>
            <div className="container mx-auto p-4">
                <Notification message={successMessage} type="success" clearMessage={() => setSuccessMessage("")} />
                <Notification message={errorMessage} type="error" clearMessage={() => setErrorMessage("")} />

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

                {selectedCardapio && (
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Selecione um ou mais itens:
                        </label>
                        <input
                            placeholder="Filtrar por nome do item"
                            type="text"
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                            className="mt-1 mb-1 p-2 border border-gray-300 rounded w-full"
                        />
                        <div className="space-y-2">
                            {itensFiltrados.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center p-2 border rounded-lg hover:bg-gray-50 transition"
                                >
                                    <input
                                        type="checkbox"
                                        id={`item-${item.id}`}
                                        value={item.id}
                                        checked={selectedItems.has(item.id)}
                                        onChange={() => handleCheckboxChange(item.id)}
                                        className="mr-2"
                                    />
                                    <img
                                        src={item.imagem_url || "https://via.placeholder.com/50"}
                                        alt={item.nome}
                                        className="w-12 h-12 object-cover rounded-lg mr-4"
                                    />
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor={`item-${item.id}`}
                                            className="text-gray-800 font-semibold cursor-pointer"
                                        >
                                            {item.nome}
                                        </label>
                                        <p className="text-gray-600 text-sm">{item.descricao}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500">
                            Selecione múltiplos itens utilizando as caixas de seleção.
                        </p>
                    </div>

                )}


                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    onClick={handleSubmit}
                >
                    Adicionar Itens ao Cardápio
                </button>
            </div>
        </AdminGuard>
    );
}
