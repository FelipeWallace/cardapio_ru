"use client";

import React, { useEffect, useState } from "react";
import AvisoPopup from "./AvisoPopup"; // Certifique-se de ajustar o caminho conforme necessário

const Avisos = () => {
  const [avisos, setAvisos] = useState([]);
  const [lastAviso, setLastAviso] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  
  useEffect(() => {
    // Fetch avisos aqui e setar o estado
    fetch("http://localhost:9081/avisos")
      .then(response => response.json())
      .then(data => {
        setAvisos(data);
        if (data.length > 0) {
          setLastAviso(data[0]); // Pega o último aviso
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      {showPopup && (
        <AvisoPopup aviso={lastAviso} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default Avisos;
