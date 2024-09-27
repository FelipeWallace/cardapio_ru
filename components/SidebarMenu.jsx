'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const SidebarMenu = () => {
    const { data: session } = useSession();
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Estado para controlar a abertura do menu

    const url = "http://localhost:9081/";

    useEffect(() => {
        // Função para verificar o perfil do usuário
        const checkIfUserIsAdmin = async () => {
            if (session && session.user) {
                try {
                    const response = await fetch(`${url}usuarios/${session.user.id}`);
                    const data = await response.json();

                    const perfil = data.perfil.trim();

                    if (perfil === "admin") {
                        setIsUserAdmin(true); // Define como true se o perfil for admin
                    } else {
                        setIsUserAdmin(false); // Caso contrário, false
                    }
                } catch (err) {
                    console.log("Erro ao buscar usuário:", err);
                }
            }
        };

        checkIfUserIsAdmin();
    }, [session]); // O useEffect depende da sessão para rodar

    if (!isUserAdmin) {
        return null; // Não renderiza nada se não for admin
    }

    return (
        <div
            onMouseEnter={() => setIsOpen(true)}  // Abrir o menu ao passar o mouse
            onMouseLeave={() => setIsOpen(false)} // Fechar o menu ao sair com o mouse
            className={`h-screen bg-slate-900 text-white flex flex-col fixed top-0 left-0 transition-all duration-300 ${
                isOpen ? ' w-64' : ' w-16' // Controlar a largura do menu
            }`}
        >
            <h2 className={`text-2xl font-bold p-4 border-b border-orange-600 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                {isOpen && "Menu"} {/* Mostra o título "Menu" quando o menu está aberto */}
            </h2>
            <nav className="flex-1 p-4">
                <ul className="space-y-4">
                    <li>
                        <Link 
                            href="/teste-cardapio" 
                            className="hover:bg-gray-700 p-2 rounded block transition-colors"
                        >
                            {isOpen ? "Cardápio" : <span className="text-center">🍽️</span>} {/* Ícone quando fechado */}
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/item" 
                            className="hover:bg-gray-700 p-2 rounded block transition-colors"
                        >
                            {isOpen ? "Gerenciar Itens" : <span className="text-center">📦</span>}
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/teste-add" 
                            className="hover:bg-gray-700 p-2 rounded block transition-colors"
                        >
                            {isOpen ? "Adicionar Itens" : <span className="text-center">➕</span>}
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/teste-rmv" 
                            className="hover:bg-gray-700 p-2 rounded block transition-colors"
                        >
                            {isOpen ? "Remover Itens" : <span className="text-center">➖</span>}
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/teste-usuarios" 
                            className="hover:bg-gray-700 p-2 rounded block transition-colors"
                        >
                            {isOpen ? "Usuários" : <span className="text-center">👤</span>}
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/teste-avaliacoes" 
                            className="hover:bg-gray-700 p-2 rounded block transition-colors"
                        >
                            {isOpen ? "Avaliações" : <span className="text-center">⭐</span>}
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/teste-avisos" 
                            className="hover:bg-gray-700 p-2 rounded block transition-colors"
                        >
                            {isOpen ? "Avisos" : <span className="text-center">⚠️</span>}
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default SidebarMenu;
