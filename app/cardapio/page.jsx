'use client'

import { useEffect, useState } from "react";
import AdminGuard from "@components/AdminGuard";
import Notification from "@components/Notification";
import AddItemModal from "@components/AddItemModal";
import RemoveItemModal from "@components/RemoveItemModal";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faMinus, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

// Componente de Formulário para criar/editar cardápios
const CardapioForm = ({ tipo, data, refeicao, titulo, setData, setRefeicao, setTitulo, limparDados, gravaDados }) => {
    return (
        <div className="mb-6 p-4 bg-white rounded shadow-md relative">
            <div className="flex flex-col">
                <input
                    type="date"
                    name="txtData"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="block w-full p-3 mt-2 border border-gray-300 rounded text-gray-700"
                    required
                />
                <input
                    type="text"
                    name="txtRefeicao"
                    placeholder="Refeição"
                    value={refeicao}
                    onChange={(e) => setRefeicao(e.target.value)}
                    className="block w-full p-3 mt-4 border border-gray-300 rounded text-gray-700"
                    required
                />
                <input
                    type="text"
                    name="txtTitulo"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="block w-full p-3 mt-4 border border-gray-300 rounded text-gray-700"
                    required
                />
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={limparDados}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={gravaDados}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {tipo === "novo" ? "Criar" : "Atualizar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Componente de Item de Cardápio com exibição dos itens do cardápio
const CardapioItem = ({ item, editarDados, apagarDados, itens, mediaAvaliacoes, fetchItens }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRmvModalOpen, setIsRmvModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleAddModalOpen = () => {
        setIsAddModalOpen(true);
    };

    const handleAddModalClose = () => {
        setIsAddModalOpen(false);
        fetchItens(item.id);
    };

    const handleRmvModalOpen = () => {
        setIsRmvModalOpen(true);
    };

    const handleRmvModalClose = () => {
        setIsRmvModalOpen(false);
        fetchItens(item.id);
    };

    return (
        <div key={item.id} className="mb-6 p-4 bg-white rounded shadow-md relative">
            <div className="flex flex-col">
                {/* Data, refeição, título e média de avaliações */}
                <div className="mb-4">
                    <strong>{new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</strong> - {item.refeicao} - {item.titulo}
                    <p className="text-gray-500">{`Média de Avaliações: ${mediaAvaliacoes(item.id)}`}</p>
                </div>

                {/* Itens expandíveis */}
                {isExpanded && (
                    <ul className="ml-4 list-disc space-y-4 mt-4">
                        {itens.map(subItem => (
                            <li key={subItem.id} className="flex items-center mb-4 space-x-4">
                                {/* Imagem do item à esquerda */}
                                <img
                                    src={subItem.imagem_url ? subItem.imagem_url : "https://i.ibb.co/pbcBmrY/ae65dba955ffbad623f51d2fae50d7e4.jpg"}
                                    alt={subItem.nome}
                                    className="object-cover rounded w-10 h-10 transition duration-300 ease-in-out transform hover:scale-110"
                                />
                                {/* Nome e descrição à direita */}
                                <div className="flex flex-col">
                                    <strong className="text-md font-semibold text-gray-800">{subItem.nome}</strong>
                                    <p className="text-sm text-gray-600">{subItem.descricao}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex flex-col items-start space-y-2 mt-4">
                    {/* Botão Exibir/Recolher */}
                    {itens && itens.length > 0 ? (
                        <button
                            onClick={toggleExpand}
                            className="text-gray-500 text-sm border border-gray-300 rounded px-3 py-2 flex items-center space-x-2 hover:text-blue-500 hover:border-blue-500 transition duration-300"
                        >
                            <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="mr-1" />
                            <span>{isExpanded ? 'Recolher Itens' : 'Exibir Itens'}</span>
                        </button>
                    ) : (
                        <p className="text-gray-500 text-sm">Nenhum item cadastrado.</p>
                    )}

                    {/* Botões de Ação */}
                    <div className="absolute right-0 bottom-0 flex space-x-4 mt-4 p-2">
                        <button
                            className="bg-green-100 text-green-500 hover:text-green-700 hover:bg-green-200 transition duration-300 flex items-center p-2 rounded"
                            onClick={handleAddModalOpen}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                        <button
                            className="bg-orange-100 text-orange-500 hover:text-orange-700 hover:bg-orange-200 transition duration-300 flex items-center p-2 rounded"
                            onClick={handleRmvModalOpen}
                        >
                            <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <button
                            onClick={() => editarDados(item.id)}
                            className="bg-blue-100 text-blue-500 hover:text-blue-700 hover:bg-blue-200 transition duration-300 flex items-center p-2 rounded"
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                            onClick={() => apagarDados(item.id)}
                            className="bg-red-100 text-red-500 hover:text-red-700 hover:bg-red-200 transition duration-300 flex items-center p-2 rounded"
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modais para adicionar e remover itens ao cardápio */}
            {isAddModalOpen && (
                <AddItemModal
                    cardapioId={item.id}
                    onClose={handleAddModalClose}
                />
            )}
            {isRmvModalOpen && (
                <RemoveItemModal
                    cardapioId={item.id}
                    onClose={handleRmvModalClose}
                />
            )}
        </div>
    );
};

const Cardapio = () => {
    const [cardapio, setCardapio] = useState([]);
    const [id, setId] = useState("");
    const [data, setData] = useState(null);
    const [refeicao, setRefeicao] = useState("");
    const [titulo, setTitulo] = useState("");
    const [itensPorCardapio, setItensPorCardapio] = useState({});
    const [filtroData, setFiltroData] = useState('');
    const [tipo, setTipo] = useState("");
    const [loading, setLoading] = useState(false);
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [busca, setBusca] = useState("");
    const url = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchCardapio();
    }, [url]);

    const fetchCardapio = async () => {
        setLoading(true);
        fetch(url + "cardapio")
            .then((response) => response.json())
            .then((data) => setCardapio(data))
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        axios.get(url + "avaliacoes")
            .then(response => setAvaliacoes(response.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        cardapio.forEach(item => fetchItens(item.id));
    }, [cardapio]);

    const fetchItens = async (cardapioId) => {
        try {
            const response = await fetch(url + `cardapio/${cardapioId}/itens`);
            const data = await response.json();
            setItensPorCardapio((prev) => ({ ...prev, [cardapioId]: data }));
        } catch (error) {
            console.error("Erro ao buscar itens:", error);
        }
    };

    const normalizarData = (data) => {
        return new Date(data).toISOString().split('T')[0];
    };

    // Ordena os cardápios por ID de forma decrescente e filtra pela data selecionada
    const cardapiosFiltrados = cardapio
        .filter((cardapio) => {
            const dataMatches = !filtroData || normalizarData(cardapio.data) === normalizarData(filtroData);
            const buscaMatches = cardapio.refeicao.toLowerCase().includes(busca.toLowerCase()) || cardapio.titulo.toLowerCase().includes(busca.toLowerCase());

            return dataMatches && buscaMatches;
        })
        .sort((a, b) => b.id - a.id);

    const novosDados = () => setTipo("novo");

    const limparDados = () => {
        setId("");
        setData(null);
        setRefeicao("");
        setTitulo("");
        setTipo("");
    };

    const editarDados = (cod) => {
        const cardapioSelecionado = cardapio.find((item) => item.id === cod);
        const { id, data, refeicao, titulo } = cardapioSelecionado;
        setTipo("editar");
        setId(id);
        setData(data);
        setRefeicao(refeicao);
        setTitulo(titulo);
        scrollToTop();
    };

    // Função para excluir o cardápio e remover os itens relacionados
    const apagarDados = async (cardapioId) => {
        setErrorMessage("");
        setSuccessMessage("");

        try {
            // Primeiro, verificar se o cardápio já foi avaliado
            const urlAvaliado = `${url}cardapio/${cardapioId}/avaliado`;
            const response = await axios.get(urlAvaliado);

            if (response.data.foiAvaliado) {
                setErrorMessage("Não é possível excluir este cardápio, pois ele já foi avaliado.");
                return;
            }

            // Se não houver avaliações, continuar com a exclusão
            // Primeiro, excluir todos os itens relacionados ao cardápio
            const urlItens = `${url}cardapio/${cardapioId}/itens`;
            await axios.delete(urlItens);

            // Depois de excluir os itens, excluir o cardápio
            const urlCardapio = `${url}cardapio/${cardapioId}`;
            await axios.delete(urlCardapio);

            // Atualizar a lista de cardápios no frontend após a exclusão
            //setCardapio((prevCardapios) => prevCardapios.filter(item => item.id !== cardapioId));
            fetchCardapio();

            setSuccessMessage("Cardápio e seus itens foram removidos com sucesso!");
        } catch (error) {
            setErrorMessage("Erro ao remover o cardápio e seus itens:");
        }
    };

    const gravaDados = () => {
        if (data && refeicao && titulo) {
            if (tipo === "novo") {
                axios.post(url + "cardapio", { data, refeicao, titulo })
                    .then((response) => atualizaListaComNovoCardapio(response))
                    .catch((err) => console.log(err));
                setSuccessMessage("Cardápio criado com sucesso!");
            } else if (tipo === "editar") {
                axios.put(url + "cardapio/" + id, { id, data, refeicao, titulo })
                    .then((response) => atualizaListaCardapioEditado(response))
                    .catch((err) => console.log(err));
                setSuccessMessage("Cardápio editado com sucesso!");
            }
        } else {
            setErrorMessage("Preencha os campos");
        }
    };

    const atualizaListaComNovoCardapio = (response) => {
        const novoCardapio = response.data;
        setCardapio([...cardapio, novoCardapio]);
        limparDados();
        fetchCardapio();
    };

    const atualizaListaCardapioEditado = (response) => {
        const cardapioEditado = response.data;
        const cardapiosAtualizados = cardapio.map(item => item.id === cardapioEditado.id ? cardapioEditado : item);
        setCardapio(cardapiosAtualizados);
        limparDados();
        fetchCardapio();
    };

    const calcularMediaAvaliacoes = (cardapioId) => {
        const avaliacoesDoCardapio = avaliacoes.filter(avaliacao => avaliacao.cardapio_id === cardapioId);
        if (avaliacoesDoCardapio.length === 0) return "Sem avaliações"; // Caso não tenha avaliações
        const totalPontuacao = avaliacoesDoCardapio.reduce((acc, avaliacao) => acc + avaliacao.pontuacao, 0);
        return (totalPontuacao / avaliacoesDoCardapio.length).toFixed(2); // Média com duas casas decimais
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <AdminGuard>
            <div className="container mx-auto">
                <Notification message={errorMessage} type="error" clearMessage={() => setErrorMessage('')} />
                <Notification message={successMessage} type="success" clearMessage={() => setSuccessMessage('')} />
                <button
                    type="button"
                    onClick={novosDados}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700 mb-4"
                >
                    Novo Cardápio
                </button>
                {tipo && (
                    <CardapioForm
                        tipo={tipo}
                        data={data}
                        refeicao={refeicao}
                        titulo={titulo}
                        setData={setData}
                        setRefeicao={setRefeicao}
                        setTitulo={setTitulo}
                        limparDados={limparDados}
                        gravaDados={gravaDados}
                    />
                )}
                <div className="mb-4">
                    <label htmlFor="datePicker" className="block text-lg font-medium text-gray-700 mb-2">
                        Filtre por data ou nome:
                    </label>
                    <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-3 md:space-y-0">
                        <input
                            type="date"
                            value={filtroData}
                            onChange={(e) => setFiltroData(e.target.value)}
                            className="w-full md:w-auto border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <input
                            type="text"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="w-full md:w-auto border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Pesquise pelo cardápio..."
                        />
                    </div>
                </div>

                {loading ? (
                    <p>Carregando cardápios...</p>
                ) : (
                    cardapiosFiltrados.length > 0 ? (
                        cardapiosFiltrados.map((item) => (
                            <CardapioItem
                                key={item.id}
                                item={item}
                                editarDados={editarDados}
                                apagarDados={apagarDados}
                                itens={itensPorCardapio[item.id]}
                                mediaAvaliacoes={calcularMediaAvaliacoes}
                                fetchItens={fetchItens}
                            />
                        ))
                    ) : (
                        <p>Nenhum cardápio encontrado.</p>
                    )
                )}
            </div>
        </AdminGuard>
    );
};

export default Cardapio;
