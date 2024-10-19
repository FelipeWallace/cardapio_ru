'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faBell as faBellRegular } from '@fortawesome/free-regular-svg-icons';

const Avisos = () => {
    const [avisos, setAvisos] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false); // Controle de exibição dos avisos
    const [hasTodayNotification, setHasTodayNotification] = useState(false); // Controle de notificação
    const [showPopup, setShowPopup] = useState(false); // Controle de exibição do modal
    const [urgentAviso, setUrgentAviso] = useState(null); // Aviso urgente do dia
    const [alerts, setAlerts] = useState([]); // Controle dos avisos de alerta e importante do dia

    const url = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchAvisos();
    }, [url]);

    const fetchAvisos = async () => {
        try {
            const response = await axios.get(url + 'avisos');
            const avisosData = response.data;
            setAvisos(avisosData);

            // Verifica avisos para a data atual
            checkForTodayNotifications(avisosData);
        } catch (error) {
            console.error('Erro ao buscar avisos:', error);
        }
    };

    const getDaysDifference = (avisoDate) => {
        const avisoDateObj = new Date(avisoDate);
        const currentDate = new Date();
        const timeDifference = currentDate - avisoDateObj;
        return timeDifference / (1000 * 3600 * 24); // Converter milissegundos em dias
    };

    const avisosRecentes = avisos.filter((aviso) => {
        const avisoDate = new Date(aviso.data);
        const currentDate = new Date();
        return avisoDate <= currentDate && getDaysDifference(aviso.data) <= 7;
    });

    const checkForTodayNotifications = (avisos) => {
        const today = new Date().toLocaleDateString('pt-BR');

        const todayAvisos = avisos.filter((aviso) => {
            const avisoData = new Date(aviso.data).toLocaleDateString('pt-BR');
            return avisoData === today;
        });

        setHasTodayNotification(todayAvisos.length > 0);

        // Filtra avisos urgentes, importantes e alertas
        const urgent = todayAvisos.find((aviso) => aviso.tipo.trim() === 'Urgente');
        // const alerts = todayAvisos.filter((aviso) => aviso.tipo.trim() === 'Alerta' || aviso.tipo === 'Importante');
        const alerts = todayAvisos.filter((aviso) => aviso.tipo.trim() !== 'Urgente');

        if (urgent) {
            setShowPopup(true);
            setUrgentAviso(urgent);
        }

        if (alerts.length > 0) {
            setAlerts(alerts);
        }
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
        setIsExpanded(!isExpanded);

        if (hasTodayNotification) {
            setHasTodayNotification(false);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setUrgentAviso(null);
    };

    const closeAlert = (id) => {
        setAlerts((prevAlerts) => prevAlerts.filter((aviso) => aviso.id !== id));
    };

    return (
        <div className="relative">
            {/* Ícone de sino com notificação */}
            <button onClick={toggleAvisos} className="text-black mt-2">
                <FontAwesomeIcon
                    icon={hasTodayNotification ? faBell : faBellRegular}
                    size="lg"
                    className={hasTodayNotification ? 'animate-pulse' : ''}
                />
                {/* {hasTodayNotification && (
                    <span className="absolute top-1.5 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border border-white animate-pulse"></span>
                )} */}
            </button>


            {/* Lista de avisos expansível */}
            {isExpanded && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-40">
                    <h3 className="text-lg font-semibold p-4 bg-gray-100 border-b">Avisos</h3>
                    <ul className="list-none space-y-4 p-4 max-h-64 overflow-y-auto">
                        {avisosRecentes.length > 0 ? (
                            avisosRecentes
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
                                ))
                        ) : (
                            <p className="text-gray-500">Nenhum aviso recente.</p>
                        )}
                    </ul>
                </div>
            )}

            {/* Modal para avisos urgentes */}
            {showPopup && urgentAviso && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-red-600">Aviso Urgente</h2>
                            <button onClick={closePopup} className="text-gray-500 hover:text-gray-700">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <p className="text-gray-700 mb-2">{urgentAviso.aviso}</p>
                        <p className="text-gray-500 text-sm">{`Publicado em: ${new Date(urgentAviso.data).toLocaleDateString()}`}</p>
                        <button onClick={closePopup} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {/* Notificações no canto inferior direito */}
            <div className="fixed bottom-4 right-4 space-y-2 z-40">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={`p-4 rounded-lg shadow-lg flex justify-between items-center ${getBackgroundColor(alert.tipo)} transition duration-300 ease-in-out`}
                    >
                        <div>
                            <strong className="text-lg font-semibold text-gray-700">{alert.tipo}</strong>
                            <p className="text-gray-600">{alert.aviso}</p>
                        </div>
                        <button onClick={() => closeAlert(alert.id)} className="text-gray-500 hover:text-gray-700">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Avisos;
