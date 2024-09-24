import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB, pool } from "@/utils/database"; // Conectar ao PostgreSQL

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        // Conectar ao banco de dados
        await connectToDB();

        // Consultar o banco de dados para recuperar informações adicionais do usuário
        const query = `
          SELECT * FROM usuarios WHERE email = $1;
        `;
        const values = [session.user.email];
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
          const user = result.rows[0];
          session.user.id = user.id; // Adicionar o ID do usuário à sessão
        }

        return session;
      } catch (error) {
        console.error("Erro ao recuperar a sessão:", error);
        return session; // Retornar a sessão mesmo em caso de erro
      }
    },

    async signIn({ profile }) {
      try {
        // Conectar ao banco de dados
        await connectToDB();

        // Verificar se o usuário já existe no banco de dados
        const query = `
          SELECT * FROM usuarios WHERE email = $1;
        `;
        const values = [profile.email];
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
          // Se o usuário já existe, apenas faça o login
          return true;
        }

        // Caso o usuário não exista, criar um novo registro
        const insertQuery = `
          INSERT INTO usuarios (nome, email, senha, perfil)
          VALUES ($1, $2, $3, 'user') RETURNING *;
        `;
        const insertValues = [
          profile.name,
          profile.email,
          profile.picture, // URL da imagem de perfil
        ];

        const insertResult = await pool.query(insertQuery, insertValues);
        console.log("Novo usuário criado:", insertResult.rows[0]);

        return true; // Retornar true para permitir o login
      } catch (error) {
        console.error("Erro ao autenticar usuário:", error);
        return false; // Retornar false em caso de erro
      }
    },
  },
});

export { handler as GET, handler as POST };
