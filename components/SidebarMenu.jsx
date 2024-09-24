'use client'

import { useState } from 'react';
import Link from 'next/link';

const SidebarMenu = () => {
    const [isOpen, setIsOpen] = useState(false); // Estado para controlar a abertura do menu

    return (
        <div
            onMouseEnter={() => setIsOpen(true)}  // Abrir o menu ao passar o mouse
            onMouseLeave={() => setIsOpen(false)} // Fechar o menu ao sair com o mouse
            className={`h-screen bg-gray-900 text-white flex flex-col fixed top-0 left-0 transition-all duration-300 ${
                isOpen ? 'w-64' : 'w-16' // Controlar a largura do menu
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
