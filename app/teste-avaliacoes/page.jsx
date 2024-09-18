// transformar em componente/pop-up
// passar como parametros cardapioId e usuariosId, sem validação no momento
// por padrão a data esta sendo setada com o dia de hoje diretamente na API
// não é possível editar e postar novas avaliações

'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import StarRating from "@components/StarRating";

const Avaliacoes = () => {
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [id, setId] = useState("");
    const [pontuacao, setPontuacao] = useState(0);
    const [comentario, setComentario] = useState("");
    const [usuariosId, setUsuariosId] = useState("");
    const [cardapioId, setCardapioId] = useState("");

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
            usuarios_id: usuariosId, // Corrigido para usar Usuarios_ID
            cardapio_id: cardapioId // Corrigido para usar Cardapio_ID
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
                        //.then ((response) => {if (response.status == 400) {console.log("Erro de validação")}})
                        .then((response) => response.json())
                        .then((data) => setAvaliacoes(data))
                        .catch((err) => console.log(err));
                    resetForm();
                })
                .catch((err) => console.log(err));
        }
    };

    const handleDelete = (id) => {
        axios.delete(`${url}avaliacoes/${id}`)
            .then(() => {
                fetch(url + "avaliacoes")
                    .then((response) => response.json())
                    .then((data) => setAvaliacoes(data))
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    };

    const handleEdit = (avaliacao) => {
        setId(avaliacao.id);
        setPontuacao(avaliacao.pontuacao);
        setComentario(avaliacao.comentario);
        setUsuariosId(avaliacao.usuarios_id); // Corrigido para usar Usuarios_ID
        setCardapioId(avaliacao.cardapio_id); // Corrigido para usar Cardapio_ID
    };

    const resetForm = () => {
        setId("");
        setPontuacao(0);
        setComentario("");
        setUsuariosId("");
        setCardapioId("");
    };

    // Ordena as avaliações pela data em ordem decrescente
    const sortedAvaliacoes = avaliacoes.sort((a, b) => new Date(b.data) - new Date(a.data));

    // Calcula a média das avaliações
    const calcularMediaAvaliacoes = () => {
        if (sortedAvaliacoes.length === 0) return 0;
        const totalPontuacao = sortedAvaliacoes.reduce((acc, avaliacao) => acc + avaliacao.pontuacao, 0);
        return (totalPontuacao / sortedAvaliacoes.length).toFixed(2); // Média com duas casas decimais
    };

    return (
        <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Avaliações</h2>
            <p className="text-lg font-semibold mb-4 text-center">{`Média das Avaliações: ${calcularMediaAvaliacoes()} estrelas`}</p>
            <div className="mb-4">
                <div className="mb-2">
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
                <input
                    type="text"
                    value={cardapioId}
                    onChange={(e) => setCardapioId(e.target.value)}
                    placeholder="ID do Cardápio"
                    className="border border-gray-300 p-2 rounded w-full mb-2"
                    required
                />
                <button type="button" onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {id ? "Atualizar Avaliação" : "Adicionar Avaliação"}
                </button>
            </div>
            <ul className="list-none space-y-4">
                {sortedAvaliacoes.map((avaliacao) => (
                    <li
                        key={avaliacao.id}
                        className="mb-2 flex justify-between items-center bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition duration-300 ease-in-out"
                    >
                        <div>
                            <strong className="text-lg font-semibold text-gray-700">
                                {`Pontuação: ${avaliacao.pontuacao} estrelas`}
                            </strong>
                            <p className="text-gray-500">{avaliacao.comentario}</p>
                            <p className="text-gray-400 text-sm">{`Data: ${new Date(avaliacao.data).toLocaleDateString()}`}</p>
                            <p className="text-gray-400 text-sm">{`ID do Usuário: ${avaliacao.usuarios_id}`}</p>
                            <p className="text-gray-400 text-sm">{`ID do Cardápio: ${avaliacao.cardapio_id}`}</p>
                        </div>
                        <div className="flex space-x-4">
                            <button onClick={() => handleEdit(avaliacao)} className="text-blue-500 hover:text-blue-700">
                                Editar
                            </button>
                            <button onClick={() => handleDelete(avaliacao.id)} className="text-red-500 hover:text-red-700">
                                Excluir
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Avaliacoes;
