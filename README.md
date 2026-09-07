# 🎬 Cinemateca Pessoal

App pessoal para catalogar e acompanhar filmes assistidos, com busca de metadata via TMDB, estatísticas de consumo e desafios de filmes (challenges).

## Stack

- **Next.js** (App Router) + TypeScript
- **Prisma 7** + SQLite (banco local)
- **TailwindCSS** para estilo
- **Recharts** para gráficos e estatísticas
- **TMDB API** para metadata dos filmes (poster, sinopse, elenco, etc)

## Funcionalidades

- [x] Setup do banco de dados (Movie, Challenge, ChallengeMovie)
- [ ] Busca de filmes via TMDB
- [ ] CRUD de filmes assistidos
- [ ] Dashboard de estatísticas (gráficos por gênero, ano, nota, etc)
- [ ] Sistema de desafios (challenges) de filmes

## Rodando localmente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz com:
   ```
   DATABASE_URL="file:./dev.db"
   TMDB_API_KEY="sua_chave_aqui"
   ```
   (gere sua chave gratuita em [themoviedb.org](https://www.themoviedb.org/settings/api))
4. Rode as migrations do Prisma:
   ```bash
   npx prisma migrate dev
   ```
5. Suba o servidor:
   ```bash
   npm run dev
   ```
6. Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura do banco

- **Movie** — filmes cadastrados, com `watched` como única fonte de verdade sobre estado de conclusão
- **Challenge** — desafios/listas temáticas de filmes
- **ChallengeMovie** — tabela de ligação entre desafios e filmes

## Projeto pessoal

Este é um projeto pessoal em desenvolvimento contínuo, sem fins comerciais.
