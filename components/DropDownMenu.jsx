'use client'

import React, { useState, useEffect } from "react";

export default function DropdownMenu() {
    const [itens, setItens] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");

    useEffect(() => {
        // Fetch all items from the database
        fetch("http://localhost:9081/itens")
            .then((response) => response.json())
            .then((data) => setItens(data))
            .catch((error) => console.error("Erro ao buscar itens:", error));
    }, []);

    const handleChange = (event) => {
        setSelectedItem(event.target.value);
        console.log("Item selecionado:", event.target.value);
    };

    return (
        <div>
            <label htmlFor="itemSelect" className="block text-lg font-medium text-gray-700 mb-2">
                Selecione um item:
            </label>
            <select
                id="itemSelect"
                value={selectedItem}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2"
            >
                <option value="">Selecione um item</option>
                {itens.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.nome}
                    </option>
                ))}
            </select>
        </div>
    );
}
