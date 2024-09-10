import Cardapio from "@components/Cardapio";
const Home = () => {

  const today = new Date();

  return (
    <section className="w-full flex-center flex-col">
        <h1 className="head_text text-center">
            Restaurante Universitário da Unifei
           <br className="max-md:hidden" />
           <span className="orange_gradient text-center">Cardápio de {today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</span>
        </h1>

        {/* Feed - Cardapio */}
        <Cardapio />
    </section>
  )
}

export default Home
