'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const Avisos = () => {
    const [avisos, setAvisos] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false); // Controle de exibição dos avisos
    const [hasTodayNotification, setHasTodayNotification] = useState(false); // Controle de notificação
    const url = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchAvisos();
    }, [url]);

    const fetchAvisos = async () => {
        try {
            const response = await axios.get(url + 'avisos');
            setAvisos(response.data);

            // Verifica se há avisos para a data atual
            checkForTodayNotifications(response.data);
        } catch (error) {
            console.error('Erro ao buscar avisos:', error);
        }
    };

    // Função para calcular o tempo decorrido em dias
    const getDaysDifference = (avisoDate) => {
        const avisoDateObj = new Date(avisoDate);
        const currentDate = new Date();
        const timeDifference = currentDate - avisoDateObj;
        const daysDifference = timeDifference / (1000 * 3600 * 24); // Converter milissegundos em dias
        return daysDifference;
    };

    // Função para filtrar avisos recentes (menos de 7 dias e não futuros)
    const avisosRecentes = avisos.filter((aviso) => {
        const avisoDate = new Date(aviso.data);
        const currentDate = new Date();
        return (avisoDate <= currentDate) && (getDaysDifference(aviso.data) <= 7);
    });

    const checkForTodayNotifications = (avisos) => {
        const today = new Date().toLocaleDateString('pt-BR'); // Data local no formato 'DD/MM/YYYY'
        
        const hasToday = avisos.some((aviso) => {
            // Normaliza a data do aviso para o formato local 'DD/MM/YYYY'
            const avisoData = new Date(aviso.data).toLocaleDateString('pt-BR');
            return avisoData === today;
        });
        
        setHasTodayNotification(hasToday);
    };
    

    const getBackgroundColor = (tipo) => {
        const tipoAviso = tipo.trim();
        switch (tipoAviso) {
            case "Importante":
                return "bg-red-300";    
            case "Urgente":
                return "bg-yellow-300"; 
            case "Informação":
                return "bg-blue-200";   
            case "Alerta":
                return "bg-orange-300"; 
            case "Promoção":
                return "bg-green-200";  
            default:
                return "bg-gray-200";   
        }
    };
    
    const toggleAvisos = () => {
        setIsExpanded(!isExpanded); // Alterna entre expandir e colapsar os avisos

        if (hasTodayNotification) {
            // Remove a notificação ao clicar
            setHasTodayNotification(false);
        }
    };

    return (
        <div className="relative">
            {/* Ícone de sino com notificação e animação */}
            <button onClick={toggleAvisos} className="text-black mt-2">
                <FontAwesomeIcon icon={faBell} size="lg" />
                {hasTodayNotification && (
                    <span className="absolute top-1.5 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border border-white animate-pulse"></span>
                )}
            </button>

            {/* Lista de avisos expansível */}
            {isExpanded && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-40">
                    <h3 className="text-lg font-semibold p-4 bg-gray-100 border-b">Avisos</h3>
                    <ul className="list-none space-y-4 p-4 max-h-64 overflow-y-auto">
                        {avisosRecentes.length > 0 ? (
                            <ul className="list-none space-y-4">
                                {avisosRecentes
                                    .sort((a, b) => new Date(b.data) - new Date(a.data))
                                    .map((aviso) => (
                                        <li
                                            key={aviso.id}
                                            className={`mb-2 flex justify-between items-center p-4 rounded-lg shadow hover:bg-gray-50 transition duration-300 ease-in-out ${getBackgroundColor(
                                                aviso.tipo
                                            )}`}
                                        >
                                            <div>
                                                <strong className="text-lg font-semibold text-gray-700">{aviso.tipo}</strong>
                                                <p className="font-semibold text-gray-600">{aviso.aviso}</p>
                                                <p className="text-gray-400 text-sm">{`Publicado em: ${new Date(aviso.data).toLocaleDateString()}`}</p>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Nenhum aviso recente.</p>
                        )}

                    </ul>
                </div>
            )}
        </div>
    );
};

export default Avisos;
