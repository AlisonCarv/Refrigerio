# Refrigério da Palavra (Aplicação Full-stack)

## Proposta do Projeto

O projeto "Refrigério da Palavra" é uma aplicação web full-stack desenvolvida como parte da disciplina de Programação Web Fullstack (ES47B-ES71). A aplicação evoluiu de um projeto puramente frontend para uma solução completa em 3 camadas: **Frontend (React.js)**, **Backend HTTP (Express.js)** e **Banco de Dados (SQLite)**.

O sistema permite que um usuário realize login para acessar funcionalidades personalizadas, como favoritar versículos e, futuramente, acompanhar seu progresso de leitura. A busca de versículos agora é mediada pelo nosso próprio backend, que utiliza um banco de dados local para validar referências e permitir uma navegação contínua entre capítulos e livros, consumindo uma API externa apenas para obter o texto dos versículos.

## Arquitetura do Sistema

O projeto adota uma arquitetura de 3 camadas:

1.  **Frontend (React.js):** Interface do usuário construída como uma Single Page Application (SPA). Lida com a renderização, o estado da interface e a comunicação com o backend via requisições HTTP.
2.  **Backend (Express.js):** Um servidor Node.js que expõe uma API RESTful. É responsável pela lógica de negócio, autenticação de usuários, e pela interação com o banco de dados e a API externa.
3.  **Banco de Dados (SQLite):** Armazena os dados da aplicação, incluindo usuários, versículos favoritos e a estrutura da Bíblia (livros, capítulos, contagem de versículos) para permitir funcionalidades avançadas de navegação.

## Funcionalidades Implementadas

*   **Login de Usuário:** Sistema de autenticação que permite a um usuário registrado acessar funcionalidades exclusivas. O backend valida as credenciais e emite um token JWT para gerenciar a sessão.
*   **Busca e Navegação de Versículos:**
    *   Formulário de busca flexível que permite a inserção de nomes de livros com pequenas variações.
    *   Backend valida a existência do livro, capítulo e versículo no banco de dados local.
    *   Implementação de botões "Próximo" e "Anterior" que permitem navegar continuamente entre versículos, capítulos e até mesmo entre livros.
*   **Favoritar Versículos:**
    *   Usuários logados podem favoritar/desfavoritar tanto os versículos buscados quanto as sugestões de leitura.
    *   A interface fornece feedback visual imediato para indicar o status de favorito.
    *   Os favoritos são salvos no banco de dados, associados ao usuário específico.
*   **Página "Meus Favoritos":** Uma página dedicada onde o usuário logado pode visualizar a lista de todos os seus versículos favoritados.
*   **Sugestão de Leitura Aleatória:** Sugestão de versículo que muda de acordo com o idioma/versão selecionado pelo usuário.

## Tecnologias e Bibliotecas Utilizadas

### Frontend
*   **React.js:** Biblioteca principal para a construção da interface do usuário.
*   **Hooks:**
    *   `useReducer` e `useContext`: Para gerenciamento de estado global da aplicação (autenticação, dados da Bíblia, favoritos).
*   **Bibliotecas Externas:**
    *   `react-router-dom`: Para criar a navegação entre as "páginas" (Busca, Favoritos) da SPA.
    *   `react-hook-form`: Para gerenciamento e validação do formulário de busca.

### Backend
*   **Node.js** com **Express.js:** Para a construção do servidor e da API RESTful.
*   **Knex.js:** Um "Query Builder" para interagir com o banco de dados de forma segura e organizada.
*   **SQLite3:** Sistema de gerenciamento de banco de dados leve e baseado em arquivo.
*   **Bibliotecas de Segurança:**
    *   `jsonwebtoken` (JWT): Para gerar e verificar tokens de autenticação.
    *   `bcryptjs`: Para criptografar e comparar as senhas dos usuários.
    *   `cors`: Para permitir a comunicação entre o frontend e o backend.

### API Externa
*   **Nome da API:** Bible API (`https://bible-api.com/`)
*   **Uso:** Consumida pelo **backend** para buscar o texto de versículos específicos e sugestões aleatórias.

## Estrutura do Projeto

O projeto é um monorepo contendo duas pastas principais: `frontend` e `backend`.

*   **`frontend/`**: Contém a aplicação React, com a estrutura de `src/components`, `src/contexts`, etc.
*   **`backend/`**: Contém o servidor Express, com a estrutura de `src/config`, `src/models`, `src/routes`, etc.

## Como Executar o Projeto Localmente

**Pré-requisitos:** Node.js e npm instalados.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/AlisonCarv/Refrigerio.git
    cd Refrigerio
    ```

2.  **Configure e Inicie o Backend:**
    *   Navegue até a pasta do backend e instale as dependências:
        ```bash
        cd backend
        npm install
        ```
    *   Execute as migrations e seeds para criar e popular o banco de dados:
        ```bash
        npm run knex:migrate
        npm run knex:seed
        ```
    *   Inicie o servidor do backend (ele rodará em `http://localhost:3001`):
        ```bash
        npm start
        ```

3.  **Configure e Inicie o Frontend:**
    *   Abra um **novo terminal**.
    *   Navegue até a pasta do frontend e instale as dependências:
        ```bash
        cd frontend
        npm install
        ```
    *   Inicie a aplicação React (ela rodará em `http://localhost:3000`):
        ```bash
        npm start
        ```

4.  **Acesse a Aplicação:**
    *   Abra seu navegador e acesse `http://localhost:3000`.
    *   Use as credenciais `admin` / `admin` para fazer o login.

## Aluno
*   **Nome:** Álison Christian Rebouças Vidal de Carvalho
*   **RA:** 2565765