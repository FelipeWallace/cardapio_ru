'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@components/AdminGuard";
import Notification from "@components/Notification";
import AddItemModal from "@components/AddItemModal";
import RemoveItemModal from "@components/RemoveItemModal";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

// Componente de Formulário para criar/editar cardápios
const CardapioForm = ({ tipo, data, refeicao, titulo, setData, setRefeicao, setTitulo, limparDados, gravaDados }) => (
    <div className="flex justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <input
                type="date"
                name="txtData"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="block w-full p-3 mt-2 border border-gray-300 rounded text-gray-700"
            />
            <input
                type="text"
                name="txtRefeicao"
                placeholder="Refeição"
                value={refeicao}
                onChange={(e) => setRefeicao(e.target.value)}
                className="block w-full p-3 mt-4 border border-gray-300 rounded text-gray-700"
            />
            <input
                type="text"
                name="txtTitulo"
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="block w-full p-3 mt-4 border border-gray-300 rounded text-gray-700"
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

// Componente de Item de Cardápio com exibição dos itens do cardápio
const CardapioItem = ({ item, editarDados, apagarDados, itens, mediaAvaliacoes }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRmvModalOpen, setIsRmvModalOpen] = useState(false);
    // const [isExpanded, setIsExpanded] = useState(false);

    // const toggleExpand = () => {
    //     setIsExpanded(!isExpanded);
    // };

    const handleAddModalOpen = () => {
        setIsAddModalOpen(true);
    };

    const handleAddModalClose = () => {
        setIsAddModalOpen(false);
    };

    const handleRmvModalOpen = () => {
        setIsRmvModalOpen(true);
    };

    const handleRmvModalClose = () => {
        setIsRmvModalOpen(false);
    };

    return (
        <div key={item.id} className="mb-6 p-4 bg-white rounded shadow-md relative">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <strong>{new Date(item.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</strong> - {item.refeicao} - {item.titulo}
                    <p>{`Média de Avaliações: ${mediaAvaliacoes(item.id)}`}</p>
                </div>
                {/* {itens && itens.length > 0? (
                    <button 
                    onClick={toggleExpand} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 ease-in-out">
                    <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                ) : null} */}
            </div>
            {itens && itens.length > 0 ? (
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
            ) : (
                <p className="ml-4 text-gray-500">Nenhum item encontrado para este cardápio.</p>
            )}
            <div className="absolute bottom-4 right-4 flex space-x-4">
                <button
                    className="text-green-500 hover:text-green-700 transition duration-300 flex items-center"
                    onClick={handleAddModalOpen}
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                </button>
                <button
                    className="text-orange-500 hover:text-orange-700 transition duration-300 flex items-center"
                    onClick={handleRmvModalOpen}
                >
                    <FontAwesomeIcon icon={faMinus} className="mr-1" />
                </button>
                <button
                    onClick={() => editarDados(item.id)}
                    className="text-blue-500 hover:text-blue-700 transition duration-300 flex items-center"
                >
                    <FontAwesomeIcon icon={faEdit} className="mr-1" />
                </button>
                <button
                    onClick={() => apagarDados(item.id)}
                    className="text-red-500 hover:text-red-700 transition duration-300 flex items-center"
                >
                    <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                </button>
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
    )
};

const Cardapio = () => {
    const [cardapio, setCardapio] = useState([]);
    const [id, setId] = useState("");
    const [data, setData] = useState(null);
    const [refeicao, setRefeicao] = useState("");
    const [titulo, setTitulo] = useState("");
    const [itensPorCardapio, setItensPorCardapio] = useState({});
    const [dataSelecionada, setDataSelecionada] = useState("");
    const [tipo, setTipo] = useState("");
    const [loading, setLoading] = useState(false);
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [busca, setBusca] = useState("");
    const router = useRouter();
    const url = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        setLoading(true);
        fetch(url + "cardapio")
            .then((response) => response.json())
            .then((data) => setCardapio(data))
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, [url]);

    useEffect(() => {
        cardapio.forEach(item => fetchItens(item.id));
    }, [cardapio]);

    useEffect(() => {
        axios.get(url + "avaliacoes")
            .then(response => setAvaliacoes(response.data))
            .catch(err => console.log(err));
    }, []);

    const fetchItens = async (cardapioId) => {
        try {
            const response = await fetch(url + `cardapio/${cardapioId}/itens`);
            const data = await response.json();
            setItensPorCardapio((prev) => ({ ...prev, [cardapioId]: data }));
        } catch (error) {
            console.error("Erro ao buscar itens:", error);
        }
    };

    // Função para normalizar a data e garantir o formato YYYY-MM-DD
    const normalizarData = (data) => {
        return new Date(data).toISOString().split('T')[0];
    };

    // Filtrar os cardápios com base na data selecionada
    // Ordena os cardápios por ID de forma decrescente e filtra pela data selecionada
    const cardapiosFiltrados = cardapio
    .sort((a, b) => b.id - a.id) // Ordena por ID de forma decrescente
    .filter((item) => {
        // Normaliza a data e verifica a busca por refeição/título em um único filtro
        const dataItemNormalizada = normalizarData(item.data);
        const dataSelecionadaNormalizada = dataSelecionada ? normalizarData(dataSelecionada) : null;

        const dataMatches = !dataSelecionada || dataItemNormalizada === dataSelecionadaNormalizada;
        const buscaMatches = item.refeicao.toLowerCase().includes(busca.toLowerCase()) || item.titulo.toLowerCase().includes(busca.toLowerCase());

        return dataMatches && buscaMatches;
    });

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
                // Se o cardápio já foi avaliado, exibir uma mensagem ao usuário e interromper o processo
                setErrorMessage("Não é possível excluir este cardápio, pois ele já foi avaliado.");
                return; // Interrompe a função
            }

            // Se não houver avaliações, continuar com a exclusão
            // Primeiro, excluir todos os itens relacionados ao cardápio
            const urlItens = `${url}cardapio/${cardapioId}/itens`;
            await axios.delete(urlItens); // Requisição DELETE para remover itens

            // Depois de excluir os itens, excluir o cardápio
            const urlCardapio = `${url}cardapio/${cardapioId}`;
            await axios.delete(urlCardapio); // Requisição DELETE para remover cardápio

            // Atualizar a lista de cardápios no frontend após a exclusão
            setCardapio((prevCardapios) => prevCardapios.filter(item => item.id !== cardapioId));

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
            } else if (tipo === "editar") {
                axios.put(url + "cardapio/" + id, { id, data, refeicao, titulo })
                    .then((response) => atualizaListaCardapioEditado(response))
                    .catch((err) => console.log(err));
            }
        } else {
            console.log("Preencha os campos");
        }
    };

    const atualizaListaComNovoCardapio = (response) => {
        const novoCardapio = response.data;
        setCardapio([...cardapio, novoCardapio]);
        limparDados();
        router.reload();
    };

    const atualizaListaCardapioEditado = (response) => {
        const cardapioEditado = response.data;
        const cardapiosAtualizados = cardapio.map(item => item.id === cardapioEditado.id ? cardapioEditado : item);
        setCardapio(cardapiosAtualizados);
        limparDados();
        router.reload();
    };

    const calcularMediaAvaliacoes = (cardapioId) => {
        const avaliacoesDoCardapio = avaliacoes.filter(avaliacao => avaliacao.cardapio_id === cardapioId);
        if (avaliacoesDoCardapio.length === 0) return "Sem avaliações"; // Caso não tenha avaliações
        const totalPontuacao = avaliacoesDoCardapio.reduce((acc, avaliacao) => acc + avaliacao.pontuacao, 0);
        return (totalPontuacao / avaliacoesDoCardapio.length).toFixed(2); // Média com duas casas decimais
    };

    return (
        <AdminGuard>
            <div className="container mx-auto p-4">
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
                            id="datePicker"
                            type="date"
                            value={dataSelecionada}
                            onChange={(e) => setDataSelecionada(e.target.value)}
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
