import '@styles/globals.css';

import Nav  from '@components/Nav';
import SidebarMenu from '@components/SidebarMenu';
import Provider from '@components/Provider';

import NavTest from '@components/Nav';

export const metadata = {
    title: 'Restaurante Universitário da Unifei',
    description: 'Cardapio do Restaurante Universitário da Unifei'
}

const RootLayout = ({ children }) => {
  return (
    <html lang='pt-br'>
        <body>
            <Provider>
                <div className='main'>
                    <div className='gradient' />              
                </div>

                <main className='app'>
                    <Nav />
                    <SidebarMenu />
                    {children}
                </main>
            </Provider>
        </body>
    </html>
  )
}

export default RootLayout
