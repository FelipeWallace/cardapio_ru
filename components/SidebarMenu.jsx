'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const SidebarMenu = () => {
    const { data: session } = useSession();
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Estado para controlar a abertura do menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Controle do menu em dispositivos móveis

    const url = "http://localhost:9081/";

    useEffect(() => {
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
    }, [session]);

    if (!isUserAdmin){
        return false
    }

    return (
        <div className="flex z-50">
            {/* Menu lateral - visível em telas grandes */}
            <div
                onMouseEnter={() => setIsOpen(true)}  // Abrir o menu ao passar o mouse
                onMouseLeave={() => setIsOpen(false)} // Fechar o menu ao sair com o mouse
                className={`hidden lg:flex h-screen bg-slate-900 text-white flex-col fixed top-0 left-0 transition-all duration-300 ${isOpen ? ' w-64' : ' w-16' // Controlar a largura do menu em telas grandes
                    }`}
            >
                <h2 className={`text-2xl font-bold p-4 border-b border-orange-600 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                    {isOpen && "Menu"} {/* Mostra o título "Menu" quando o menu está aberto */}
                </h2>
                <nav className="flex-1 p-4">
                    <ul className="space-y-4">
                        {/* Lista de links */}
                        <li>
                            <Link href="/teste-cardapio" className="hover:bg-gray-700 p-2 rounded block transition-colors">
                                {isOpen ? "Cardápio" : <span className="text-center">🍽️</span>}
                            </Link>
                        </li>
                        <li>
                            <Link href="/item" className="hover:bg-gray-700 p-2 rounded block transition-colors">
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

            {/* Botão do burger menu - visível em telas pequenas */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-white focus:outline-none"
                >
                    {/* Ícone do menu hambúrguer */}
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>

            {/* Menu lateral mobile - visível apenas em telas pequenas */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed top-0 left-0 h-screen w-64 bg-slate-900 text-white z-40 p-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white absolute top-4 right-4 focus:outline-none"
                    >
                        {/* Ícone para fechar o menu */}
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <nav className="flex-1 mt-10">
                        <ul className="space-y-4">
                            <li>
                                <Link href="/teste-cardapio" className="hover:bg-gray-700 p-2 rounded block transition-colors">
                                    Cardápio
                                </Link>
                            </li>
                            <li>
                                <Link href="/item" className="hover:bg-gray-700 p-2 rounded block transition-colors">
                                    Gerenciar Itens
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
            )}
        </div>
    );
};

export default SidebarMenu;
