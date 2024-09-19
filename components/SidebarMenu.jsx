import Link from 'next/link';

const SidebarMenu = () => {
    return (
        <div className="w-64 h-screen bg-gray-900 text-white flex flex-col fixed left-0 top-0">
            <h2 className="text-2xl font-bold p-4 border-b border-orange-600">Menu</h2>
            <nav className="flex-1 p-4">
                <ul className="space-y-4">
                    <li>
                        <Link 
                            href="/teste-cardapio" 
                            className="hover:bg-gray-700 p-2 rounded block transition-colors"
                        >
                            Cardápio
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/item" 
                            className="hover:bg-gray-700 p-2 rounded block transition-colors"
                        >
                            Gerenciar Itens
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/teste-add" 
                            className="hover:bg-gray-700 p-2 rounded block transition-colors"
                        >
                            Adicionar Itens
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/teste-rmv" 
                            className="hover:bg-gray-700 p-2 rounded block transition-colors"
                        >
                            Remover Itens
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/teste-usuarios" 
                            className="hover:bg-gray-700 p-2 rounded block transition-colors"
                        >
                            Usuarios
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/teste-avaliacoes" 
                            className="hover:bg-gray-700 p-2 rounded block transition-colors"
                        >
                            Avaliações
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/teste-avisos" 
                            className="hover:bg-gray-700 p-2 rounded block transition-colors"
                        >
                            Avisos
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default SidebarMenu;
