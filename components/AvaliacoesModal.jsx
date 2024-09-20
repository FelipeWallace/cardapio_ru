import React, { useEffect, useState } from "react";
import axios from "axios";
import StarRating from "@components/StarRating";

const AvaliacoesModal = ({ cardapioId, onClose }) => {
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [id, setId] = useState("");
    const [pontuacao, setPontuacao] = useState(0);
    const [comentario, setComentario] = useState("");
    const [usuariosId, setUsuariosId] = useState("");

    const url = "http://localhost:9081/";

    useEffect(() => {
        fetch(url + "avaliacoes")
            .then((response) => response.json())
            .then((data) => setAvaliacoes(data))
            .catch((err) => console.log(err));
    }, [url]);

    const handleSubmit = () => {
        const avaliacaoData = { 
            pontuacao, 
            comentario, 
            usuarios_id: usuariosId, 
            cardapio_id: cardapioId 
        };

        if (id) {
            axios.put(`${url}avaliacoes/${id}`, avaliacaoData)
                .then(() => {
                    fetch(url + "avaliacoes")
                        .then((response) => response.json())
                        .then((data) => setAvaliacoes(data))
                        .catch((err) => console.log(err));
                    resetForm();
                })
                .catch((err) => console.log(err));
        } else {
            axios.post(`${url}avaliacoes`, avaliacaoData)
                .then(() => {
                    fetch(url + "avaliacoes")
                        .then((response) => response.json())
                        .then((data) => setAvaliacoes(data))
                        .catch((err) => console.log(err));
                    resetForm();
                })
                .catch((err) => console.log(err));
        }
        onClose();
    };

    const resetForm = () => {
        setId("");
        setPontuacao(0);
        setComentario("");
        setUsuariosId("");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Avaliar Cardápio</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold">Pontuação:</label>
                    <StarRating rating={pontuacao} setRating={setPontuacao} />
                </div>
                <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Comentário"
                    className="border border-gray-300 p-2 rounded w-full mb-2"
                />
                <input
                    type="text"
                    value={usuariosId}
                    onChange={(e) => setUsuariosId(e.target.value)}
                    placeholder="ID do Usuário"
                    className="border border-gray-300 p-2 rounded w-full mb-2"
                    required
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {id ? "Atualizar Avaliação" : "Adicionar Avaliação"}
                </button>
                <button
                    onClick={onClose}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default AvaliacoesModal;
