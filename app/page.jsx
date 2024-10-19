"use client"

import Cardapio from "@components/Cardapio";
import { useState } from "react";

const Home = () => {
  const [today, setToday] = useState(new Date());

  return (
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        <span className="hidden md:block">Restaurante Universitário da Unifei</span>
        <span className="red_gradient text-center">
          Cardápio de {today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
        </span>
      </h1>
      <Cardapio
        today={today}
        setToday={setToday}
      />
    </section>
  )
}

export default Home
