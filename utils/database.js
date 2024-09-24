import { Pool } from 'pg';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Cria uma nova pool de conexões usando a string de conexão do .env
const pool = new Pool({
  connectionString: process.env.POSTGRESQL_URI, // Obtém a string de conexão do arquivo .env
});

// Função para conectar ao banco de dados e lidar com erros
const connectToDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Conectado ao PostgreSQL com sucesso.');
    client.release(); // Libera a conexão depois de testar
  } catch (error) {
    console.error('Erro ao conectar ao PostgreSQL:', error);
  }
};

export { pool, connectToDB };
