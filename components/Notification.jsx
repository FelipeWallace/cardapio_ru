'use client';

import { useEffect } from 'react';

const Notification = ({ message, type, clearMessage }) => {
  useEffect(() => {
    // Limpa a mensagem após 5 segundos
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 5000);
      return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
    }
  }, [message, clearMessage]);

  if (!message) return null; // Não renderiza nada se não houver mensagem

  // Define o estilo com base no tipo de mensagem (erro ou sucesso)
  const notificationStyle = type === 'error'
    ? 'bg-red-500 text-white'
    : 'bg-green-500 text-white';

  return (
    <div className={`fixed top-4 right-4 p-4 rounded shadow-lg transition-transform duration-300 ${notificationStyle} z-50`}>
      {message}
    </div>
  );
};

export default Notification;
