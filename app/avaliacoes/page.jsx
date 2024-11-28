'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import StarRating from "@components/StarRating";
// import Notification from "@components/Notification";
import AdminGuard from "@components/AdminGuard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from "@node_modules/@fortawesome/free-solid-svg-icons";

const UserDetails = ({ userId }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}usuarios/${userId}`)
            .then((response) => response.json())
            .then((data) => setUser(data))
            .catch((error) => console.error('Erro ao buscar usuário:', error));
    }, [userId]);

    if (!user) return <p>Carregando...</p>;

    return (
        <div className="flex items-center space-x-2">
            <img
                src={user.foto || "https://i.ibb.co/6HJpnRs/20c00f0f135c950096a54b7b465e45cc.jpg"}
                alt="Foto do usuário"
                className="w-8 h-8 rounded-full" />
            <p className="text-gray-500 font-bold text-sm">{user.nome}</p>
        </div>
    );
};

const CardapioDetails = ({ cardapioId }) => {
    const [cardapio, setCardapio] = useState(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}cardapio/${cardapioId}`)
            .then((response) => response.json())
            .then((data) => setCardapio(data))
            .catch((error) => console.error('Erro ao buscar cardápio:', error));
    }, [cardapioId]);

    if (!cardapio) return <p>Carregando...</p>;

    return <p className="text-gray-500 text-sm">Cardápio: {cardapio[0].titulo}</p>
};


const Avaliacoes = () => {
    const [avaliacoes, setAvaliacoes] = useState([]);
    // const [id, setId] = useState("");
    // const [pontuacao, setPontuacao] = useState(0);
    // const [comentario, setComentario] = useState("");
    // const [usuariosId, setUsuariosId] = useState("");
    // const [cardapioId, setCardapioId] = useState("");
    // const [errorMessage, setErrorMessage] = useState("");
    // const [successMessage, setSuccessMessage] = useState("");
    const [filtroDataInicio, setFiltroDataInicio] = useState('');
    const [filtroDataFim, setFiltroDataFim] = useState('');
    const url = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(url + "avaliacoes")
            .then((response) => response.json())
            .then((data) => setAvaliacoes(data))
            .catch((err) => console.log(err));
    }, [url]);

    // const handleSubmit = () => {
    //     setErrorMessage(""); // Limpa a mensagem de erro ao iniciar uma nova submissão
    //     setSuccessMessage(""); // Limpa a mensagem de sucesso ao iniciar uma nova submissão

    //     const avaliacaoData = {
    //         pontuacao,
    //         comentario,
    //         usuarios_id: usuariosId, // Corrigido para usar Usuarios_ID
    //         cardapio_id: cardapioId   // Corrigido para usar Cardapio_ID
    //     };

    //     if (id) {
    //         axios.put(`${url}avaliacoes/${id}`, avaliacaoData)
    //             .then((response) => {
    //                 if (response.status >= 200 && response.status < 300) {
    //                     setSuccessMessage("Avaliação atualizada com sucesso!"); // Exibe mensagem de sucesso
    //                     return fetch(url + "avaliacoes")
    //                         .then((response) => response.json())
    //                         .then((data) => setAvaliacoes(data))
    //                         .catch((err) => setErrorMessage("Erro ao buscar avaliações."));
    //                 } else {
    //                     setErrorMessage("Erro ao atualizar avaliação: " + response.statusText);
    //                 }
    //                 resetForm();
    //             })
    //             .catch((err) => {
    //                 if (err.response && err.response.status === 400) {
    //                     setErrorMessage("Erro de validação: " + err.response.data.error);
    //                 } else {
    //                     setErrorMessage("Erro ao atualizar avaliação: " + err.message);
    //                 }
    //             });
    //     } else {
    //         axios.post(`${url}avaliacoes`, avaliacaoData)
    //             .then((response) => {
    //                 if (response.status >= 200 && response.status < 300) {
    //                     setSuccessMessage("Avaliação criada com sucesso!"); // Exibe mensagem de sucesso
    //                     return fetch(url + "avaliacoes")
    //                         .then((response) => response.json())
    //                         .then((data) => setAvaliacoes(data))
    //                         .catch((err) => setErrorMessage("Erro ao buscar avaliações."));
    //                 } else {
    //                     setErrorMessage("Erro ao criar avaliação: " + response.statusText);
    //                 }
    //                 resetForm();
    //             })
    //             .catch((err) => {
    //                 if (err.response && err.response.status === 400) {
    //                     setErrorMessage("Erro de validação: " + err.response.data.error);
    //                 } else {
    //                     setErrorMessage("Erro ao criar avaliação: " + err.message);
    //                 }
    //             });
    //     }
    // };

    // const handleDelete = (id) => {
    //     axios.delete(`${url}avaliacoes/${id}`)
    //         .then(() => {
    //             fetch(url + "avaliacoes")
    //                 .then((response) => response.json())
    //                 .then((data) => setAvaliacoes(data))
    //                 .catch((err) => console.log(err));
    //         })
    //         .catch((err) => console.log(err));
    // };

    // const handleEdit = (avaliacao) => {
    //     setId(avaliacao.id);
    //     setPontuacao(avaliacao.pontuacao);
    //     setComentario(avaliacao.comentario);
    //     setUsuariosId(avaliacao.usuarios_id);
    //     setCardapioId(avaliacao.cardapio_id);
    // };

    // const resetForm = () => {
    //     setId("");
    //     setPontuacao(0);
    //     setComentario("");
    //     setUsuariosId("");
    //     setCardapioId("");
    // };

    // Ordena as avaliações pela data em ordem decrescente

    const sortedAvaliacoes = avaliacoes
        .filter((avaliacao) => {
            return (
                (!filtroDataInicio || new Date(avaliacao.data) >= new Date(filtroDataInicio)) &&
                (!filtroDataFim || new Date(avaliacao.data) <= new Date(filtroDataFim))
            );
        })
        .sort((a, b) => new Date(b.data) - new Date(a.data));

    const calcularMediaAvaliacoes = () => {
        if (sortedAvaliacoes.length === 0) return 0;
        const totalPontuacao = sortedAvaliacoes.reduce((acc, avaliacao) => acc + avaliacao.pontuacao, 0);
        return (totalPontuacao / sortedAvaliacoes.length).toFixed(2); // Média com duas casas decimais
    };

    return (
        <AdminGuard>
            <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-md
                sm:max-w-sm 
                md:max-w-md 
                lg:max-w-2xl 
                xl:max-w-4xl"
            >
                {/* <Notification message={errorMessage} type="error" clearMessage={() => setErrorMessage('')} />
                <Notification message={successMessage} type="success" clearMessage={() => setSuccessMessage('')} /> */}

                <h2 className="text-2xl font-bold mb-4 text-center">Avaliações</h2>
                <p className="text-lg font-semibold mb-4 text-center">{`Média das Avaliações: ${calcularMediaAvaliacoes()} estrelas`}</p>
                {/* <div className="mb-4">
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
                </div> */}
                <div className="mb-6">
                    {/* Título dos Filtros */}
                    <h2 className="text-lg text-center font-semibold text-gray-700 mb-4">Filtre por data de inicio e fim</h2>

                    {/* Filtros */}
                    <div className="flex flex-col sm:flex-row sm:space-x-4 items-center justify-center">
                        <div className="relative w-full sm:w-auto mb-4 sm:mb-0">
                            <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="date"
                                value={filtroDataInicio}
                                onChange={(e) => setFiltroDataInicio(e.target.value)}
                                className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Data Início"
                            />
                        </div>
                        <div className="relative w-full sm:w-auto">
                            <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="date"
                                value={filtroDataFim}
                                onChange={(e) => setFiltroDataFim(e.target.value)}
                                className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded focus:outline-none focus:border-blue-500"
                                placeholder="Data Fim"
                            />
                        </div>
                    </div>
                </div>

                <ul className="list-none space-y-4">
                    {sortedAvaliacoes.map((avaliacao) => (
                        <li
                            key={avaliacao.id}
                            className="mb-2 flex justify-between items-center bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition duration-300 ease-in-out"
                        >
                            <div>
                                <UserDetails userId={avaliacao.usuarios_id} />
                                <StarRating rating={avaliacao.pontuacao} />
                                {avaliacao.comentario && <p className="text-gray-500">"{avaliacao.comentario}"</p>}
                                <CardapioDetails cardapioId={avaliacao.cardapio_id} />
                                <p className="text-gray-400 text-sm">{`Data da avaliação: ${new Date(avaliacao.data).toLocaleDateString("pt-BR", { timeZone: "UTC" })}`}</p>
                            </div>
                            {/* <div className="flex space-x-4">
                                <button onClick={() => handleEdit(avaliacao)} className="text-blue-500 hover:text-blue-700">
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(avaliacao.id)} className="text-red-500 hover:text-red-700">
                                    Excluir
                                </button>
                            </div> */}
                        </li>
                    ))}
                </ul>
            </div>
        </AdminGuard>
    );
};

export default Avaliacoes;
