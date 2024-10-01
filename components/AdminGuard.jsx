'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

const AdminGuard = ({ children }) => {
    const { data: session, status } = useSession();
    const [isUserAdmin, setIsUserAdmin] = useState(null);
    const url = 'http://localhost:9081/'; // Ajuste para sua URL correta

    useEffect(() => {
        const checkIfUserIsAdmin = async () => {
            if (session && session.user) {
                try {
                    const response = await fetch(`${url}usuarios/${session.user.id}`);
                    const data = await response.json();
                    const perfil = data.perfil.trim();
                    setIsUserAdmin(perfil === "admin");
                } catch (err) {
                    console.log("Erro ao buscar usuário:", err);
                    setIsUserAdmin(false); // Em caso de erro, considere não admin
                }
            } else {
                setIsUserAdmin(false); // Se não há sessão, não é admin
            }
        };

        checkIfUserIsAdmin();
    }, [session]);

    // Verifica o status da sessão
    if (status === 'loading') {
        return <p>Carregando...</p>;
    }

    if (status === 'unauthenticated' || !session) {
        return (
            <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md">
                <p className="text-red-500">Você precisa estar logado para acessar esta página.</p>
                <button onClick={() => signIn()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Fazer login
                </button>
            </div>
        );
    }

    // Verifica se o usuário é admin
    if (isUserAdmin === null) {
        return <p>Carregando...</p>; // Exibe "Carregando..." enquanto verifica se é admin
    }

    if (!isUserAdmin) {
        return (
            <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md">
                <p className="text-red-500">Você não tem permissão para acessar esta página.</p>
            </div>
        );
    }

    return <>{children}</>; // Renderiza os filhos se for admin
};

export default AdminGuard;
