import { Pool } from 'pg';

let pool;

export const connectToDB = async () => {
  if (pool) {
    console.log('PostgreSQL is already connected');
    return pool;
  }

  try {
    // Criação do pool de conexões
    pool = new Pool({
      connectionString: process.env.POSTGRESQL_URI, // URL do PostgreSQL vinda das variáveis de ambiente
      max: 10, // Número máximo de conexões simultâneas
      idleTimeoutMillis: 30000, // Tempo de inatividade antes de liberar uma conexão
      connectionTimeoutMillis: 2000, // Tempo limite para tentar conectar
    });

    // Testa a conexão
    await pool.query('SELECT NOW()');

    console.log('PostgreSQL connected');
    return pool;
  } catch (error) {
    console.error('Erro ao conectar ao PostgreSQL:', error);
    throw error;
  }
};
