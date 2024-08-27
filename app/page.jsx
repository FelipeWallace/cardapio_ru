import Feed from "@components/Feed"
const Home = () => {

  const today = new Date();

  return (
    <section className="w-full flex-center flex-col">
        <h1 className="head_text text-center">
            Restaurante Universitário da Unifei
           <br className="max-md:hidden" />
           <span className="orange_gradient text-center">Cardápio de {today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })}</span>
        </h1>
        <p className="desc text-center">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
            Asperiores, vel quis nemo esse ex officiis sint quidem. 
            Nihil impedit ea itaque non maiores a distinctio magnam reprehenderit facilis accusantium. Aut?
        </p>

        {/* Feed - Cardapio */}
        <Feed />
    </section>
  )
}

export default Home
