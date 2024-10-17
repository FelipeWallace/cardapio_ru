'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AdminGuard = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isUserAdmin, setIsUserAdmin] = useState(null);
    const url = process.env.NEXT_PUBLIC_API_URL;

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

    useEffect(() => {
        if (session && !isUserAdmin) {
            // Só redireciona se houver sessão e o usuário não for admin
            const timeout = setTimeout(() => {
                router.push('/');
            }, 5000);

            // Limpa o timeout ao desmontar o componente
            return () => clearTimeout(timeout);
        }
    }, [isUserAdmin, session, router]);

    // Verifica o status da sessão
    if (status === 'loading') {
        return <p>Carregando...</p>;
    }

    if (status === 'unauthenticated' || !session) {
        return (
            <div className="p-6 max-w-md w-full bg-white rounded-lg shadow-md">
                <p className="text-center text-red-500 mb-4">Você precisa estar logado para acessar esta página.</p>
                <div className="flex justify-center">
                    <button onClick={() => signIn()} className="bg-blue-500 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300">
                        Fazer login
                    </button>
                </div>
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
