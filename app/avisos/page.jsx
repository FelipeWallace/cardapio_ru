'use client'

import React, { useEffect, useState } from 'react'
import axios from "axios";

const Avisos = () => {
  const [avisos, setAvisos] = useState([]);
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  //const [hora, setHora] = useState(null);
  const [aviso, setAviso] = useState("");
  const [tipo, setTipo] = useState("");
  const [usuarios_id, setUsuarios_id] = useState("");
  const [modo, setModo] = useState("");

  const url = "https://restaurante-api-swart.vercel.app/";

  useEffect(() => {
      fetch(url + "avisos")
          .then((response) => response.json())
          .then((data) => setAvisos(data))
          .catch((err) => console.log(err));
  }, [url]);

  function novosDados() {
      setModo("novo");
  }
  function limparDados() {
    setId("");
    setData(null);
    setAviso("");
    setTipo("");
    setUsuarios_id("");
    setModo("");
  }

  function editarDados(cod) {
    let noticia = avisos.find((item) => item.id === cod);
    const { id, data, aviso, tipo, usuarios_id } = noticia;
    setModo("editar");
    setId(id);
    setData(data);
    setAviso(aviso);
    setTipo(tipo);
    setUsuarios_id(usuarios_id);
  }

  function apagarDados(cod) {
      axios.delete(url + "avisos/" + cod).then(() => {
          //atualizar a lista
          setAvisos(avisos.filter(item => item.id !== cod));
      });
  }

  function atualizaListaComNovoAviso(response) {
      let { id, data, aviso, tipo, usuarios_id } = response.data;
      let obj = { id: id, data: data, aviso: aviso, tipo: tipo, usuarios_id: usuarios_id };
      let note = avisos;
      note.push(obj);
      setAvisos(note);
      limparDados("");
  }

  function atualizaListaAvisoEditado(response) {
      let { id } = response.data;
      const index = avisos.findIndex(item => item.id == id);
      let notes = avisos;
      notes[index].data = data;
      notes[index].aviso = aviso;
      notes[index].tipo = tipo;
      notes[index].usuarios_id = usuarios_id;
      setAvisos(notes);
      limparDados("");
  }

  function gravaDados() {
      if (data !== null && aviso !== "" && tipo !== "" && usuarios_id !== "") {
          if (modo === "novo") {
              axios
                  .post(url + "avisos", {
                      data: data,
                      aviso: aviso,
                      tipo: tipo,
                      usuarios_id: usuarios_id,
                  })
                  .then((response) => atualizaListaComNovoAviso(response))
                  .catch((err) => console.log(err));
          } else if (modo === "editar") {
              axios
                  .put(url + "avisos/" + id, {
                      id: id,
                      data: data,
                      aviso: aviso,
                      tipo: tipo,
                      usuarios_id: usuarios_id,
                  })
                  .then((response) => atualizaListaAvisoEditado(response))
                  .catch((err) => console.log(err));
          }
      } else {
          console.log("Preencha os campos");
      }
  }

  return (
      <div className="p-6 font-sans">
          <button 
              type="button" 
              onClick={novosDados}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
              Novo
          </button>
          {modo ? (
              <>
                  <input
                      type="date"
                      name="txtData"
                      value={data}
                      onChange={(e) => {
                          setData(e.target.value);
                      }}
                      className="block w-full max-w-xs p-2 mt-2 border border-gray-300 rounded"
                  />
                  
                  <input
                      type="text"
                      name="txtAviso"
                      placeholder='Aviso'
                      value={aviso}
                      onChange={(e) => {
                          setAviso(e.target.value);
                      }}
                      className="block w-full max-w-xs p-2 mt-2 border border-gray-300 rounded"
                  />
                  <input
                      type="text"
                      name="txtTipo"
                      placeholder="Tipo"
                      value={tipo}
                      onChange={(e) => {
                          setTipo(e.target.value);
                      }}
                      className="block w-full max-w-xs p-2 mt-2 border border-gray-300 rounded"
                  />
                  <input
                      type="text"
                      name="txtUsuarios_id"
                      placeholder='Usuário'
                      value={usuarios_id}
                      onChange={(e) => {
                          setUsuarios_id(e.target.value);
                      }}
                      className="block w-full max-w-xs p-2 mt-2 border border-gray-300 rounded"
                  />
                  <button 
                      type="button" 
                      onClick={limparDados}
                      className="bg-gray-500 text-white px-4 py-2 mt-2 rounded hover:bg-gray-700 mr-2"
                  >
                      Cancelar
                  </button>
                  <button 
                      type="button" 
                      onClick={gravaDados}
                      className="bg-gray-500 text-white px-4 py-2 mt-2 rounded hover:bg-gray-700"
                  >
                      Gravar
                  </button>
              </>
          ) : (
              false
          )}

          {avisos
              ? avisos.map((item) => {
                  return (
                      <div key={item.id} className="flex items-center justify-between p-2 mt-4 border-b">
                          <div className="flex items-center">
                              {" "}
                              {item.id} - {item.aviso} - {item.tipo}{" "}
                              <img
                                  alt="Editar"
                                  src="/assets/icons/copy.svg"
                                  id={item.id}
                                  height={20}
                                  width={20}
                                  className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform"
                                  onClick={(e) => editarDados(item.id)}
                              />
                              <img
                                  alt="Apagar"
                                  src="/assets/icons/lixeira.svg"
                                  id={item.id}
                                  height={20}
                                  width={20}
                                  className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform ml-4"
                                  onClick={(e) => apagarDados(item.id)}
                              />
                          </div>
                      </div>
                  );
              })
              : false}
      </div>
  );

}

export default Avisos
