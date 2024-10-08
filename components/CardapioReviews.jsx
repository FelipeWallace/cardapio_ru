'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import StarRating from "@components/StarRating";

const CardapioReviews = ({ CardapioId, onClose }) => {
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [usuarios, setUsuarios] = useState({});
    const url = "http://localhost:9081/";

    useEffect(() => {
        const fetchAvaliacoes = async () => {
            try {
                const response = await axios.get(`${url}cardapio/${CardapioId}/avaliacoes`);
                setAvaliacoes(response.data);
                // Agora buscamos as informações dos usuários
                const usuarioIds = response.data.map(avaliacao => avaliacao.usuarios_id);
                const uniqueUserIds = [...new Set(usuarioIds)]; // Remover IDs duplicados
                const usuarioPromises = uniqueUserIds.map(id => axios.get(`${url}usuarios/${id}`));
                const usuarioResponses = await Promise.all(usuarioPromises);
                
                const usuariosData = {};
                usuarioResponses.forEach(res => {
                    const usuario = res.data;
                    usuariosData[usuario.id] = usuario; // Armazenar no objeto
                });
                setUsuarios(usuariosData); // Atualiza o estado com as informações dos usuários
            } catch (error) {
                console.error('Erro ao buscar avaliações ou usuários:', error);
            }
        };

        fetchAvaliacoes();
    }, [CardapioId, url]);

    // Ordena as avaliações pela data em ordem decrescente
    const sortedAvaliacoes = avaliacoes.sort((a, b) => new Date(b.data) - new Date(a.data));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">Avaliações</h2>
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {sortedAvaliacoes.map((avaliacao) => (
                        <li
                            key={avaliacao.id}
                            className="mb-2 flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow hover:bg-gray-200 transition duration-300 ease-in-out"
                        >
                            <div className="flex items-center">
                                {/* Exibe a foto do usuário */}
                                {usuarios[avaliacao.usuarios_id]?.foto && (
                                    <img
                                        src={usuarios[avaliacao.usuarios_id].foto}
                                        alt="Foto do Usuário"
                                        className="w-10 h-10 rounded-full mr-2"
                                    />
                                )}
                                <div>
                                    <p className="text-black font-bold text-sm">{`${usuarios[avaliacao.usuarios_id]?.nome || 'Desconhecido'}`}</p>
                                    <StarRating rating={avaliacao.pontuacao} />
                                    <p className="text-gray-700 font-semibold">{avaliacao.comentario}</p>
                                    <p className="text-gray-400 text-sm">{`Data: ${new Date(avaliacao.data).toLocaleDateString()}`}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CardapioReviews;
