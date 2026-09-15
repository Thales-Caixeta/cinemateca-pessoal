# 🎬 Noctreel

App pessoal para catalogar e acompanhar filmes assistidos, com busca de metadata via TMDB, sistema de nota e anotações pessoais, e (em breve) estatísticas de consumo e desafios de filmes (challenges).

> Antigo "Cinemateca Pessoal" — pasta do repositório ainda se chama `cinemateca-pessoal`.

## Stack

- **Next.js** (App Router) + TypeScript
- **Prisma 7** + SQLite (banco local)
- **TailwindCSS** para estilo
- **Recharts** para gráficos e estatísticas (instalado, ainda não usado)
- **TMDB API** para metadata dos filmes (poster, sinopse, tagline, gêneros, diretor/elenco, etc)

## Funcionalidades

- [x] Setup do banco de dados (Movie, Challenge, ChallengeMovie)
- [x] Busca de filmes via TMDB
- [x] CRUD de filmes assistidos
- [x] Nota pessoal com decimais (arraste/toque) e anotações
- [x] Selo de "assistido" com contagem de rewatches
- [x] Descrição editável (override do texto da TMDB) + tagline, diretor e elenco
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

- **Movie** — filmes cadastrados, com `watched` como única fonte de verdade sobre estado de conclusão. Também guarda `timesWatched` (rewatches), `rating` (nota decimal 0-10), `notes` (anotações pessoais) e `overview` (descrição editável, substitui a da TMDB quando preenchida)
- **Challenge** — desafios/listas temáticas de filmes
- **ChallengeMovie** — tabela de ligação entre desafios e filmes

## Projeto pessoal

Este é um projeto pessoal em desenvolvimento contínuo, sem fins comerciais.
