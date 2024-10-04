'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import StarRating from "@components/StarRating";
import Notification from "@components/Notification";

const AvaliacoesModal = ({ cardapioId, userId, onClose }) => {
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [pontuacao, setPontuacao] = useState(0);
    const [comentario, setComentario] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const url = "http://localhost:9081/";

    useEffect(() => {
        fetch(url + "avaliacoes")
            .then((response) => response.json())
            .then((data) => setAvaliacoes(data))
            .catch((err) => console.log(err));
    }, [url]);

    const handleSubmit = () => {
        setErrorMessage("");
        setSuccessMessage("");

        const avaliacaoData = {
            pontuacao,
            comentario,
            usuarios_id: userId,
            cardapio_id: cardapioId
        };

        axios.post(`${url}avaliacoes`, avaliacaoData)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    setSuccessMessage("Avaliação criada com sucesso!");
                    return fetch(url + "avaliacoes")
                        .then((response) => response.json())
                        .then((data) => setAvaliacoes(data))
                        .catch((err) => setErrorMessage("Erro ao buscar avaliações."));
                } else {
                    setErrorMessage("Erro ao criar avaliação: " + response.statusText);
                }
                resetForm();
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) {
                    setErrorMessage("Erro de validação: " + err.response.data.error);
                } else {
                    setErrorMessage("Erro ao criar avaliação: " + err.message);
                }
            });
        setTimeout(() => {
            onClose();
        }, 3000);
    };

    const resetForm = () => {
        setPontuacao(0);
        setComentario("");
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Avaliar Cardápio</h2>

                <Notification message={errorMessage} type="error" clearMessage={() => setErrorMessage('')} />
                <Notification message={successMessage} type="success" clearMessage={() => setSuccessMessage('')} />

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
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
                    Adicionar Avaliação
                </button>
                <button
                    onClick={onClose}
                    className="mt-4 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default AvaliacoesModal;
