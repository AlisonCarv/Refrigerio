# Refrigério da Palavra (Aplicação Full-stack)

## Proposta do Projeto

O projeto "Refrigério da Palavra" é uma aplicação web full-stack desenvolvida como parte da disciplina de Programação Web Fullstack (ES47B-ES71). A aplicação evoluiu de um projeto puramente frontend para uma solução completa em 3 camadas: **Frontend (React.js)**, **Backend HTTP (Express.js)** e **Banco de Dados (SQLite)**.

O sistema permite que um usuário realize login para acessar funcionalidades personalizadas, como favoritar versículos e navegar continuamente entre eles. A busca de versículos é mediada por um backend próprio, que utiliza um banco de dados local para validar referências e permitir a navegação entre capítulos e livros, consumindo uma API externa apenas para obter o texto dos versículos.

## Arquitetura do Sistema

O projeto adota uma arquitetura de 3 camadas:

1.  **Frontend (React.js):** Interface do usuário construída como uma Single Page Application (SPA). Lida com a renderização, o estado da interface e a comunicação com o backend via requisições HTTP.
2.  **Backend (Express.js):** Um servidor Node.js que expõe uma API RESTful. É responsável pela lógica de negócio, autenticação de usuários, e pela interação com o banco de dados e a API externa.
3.  **Banco de Dados (SQLite):** Armazena os dados da aplicação, incluindo usuários, versículos favoritos e a estrutura completa da Bíblia (livros, capítulos, contagem de versículos) para permitir funcionalidades avançadas.

## Funcionalidades Implementadas

*   **Autenticação de Usuário:** Sistema de login com validação de credenciais no backend e gerenciamento de sessão via Tokens JWT com tempo de expiração.
*   **Busca e Navegação Inteligente:**
    *   Formulário de busca flexível que permite a inserção de nomes de livros com variações (ex: "Joao", "joão").
    *   Backend valida a existência do livro, capítulo e versículo no banco de dados local.
    *   Implementação de botões "Próximo" e "Anterior" que permitem navegar continuamente entre versículos, capítulos e até mesmo entre livros.
*   **Sistema de Favoritos:**
    *   Usuários logados podem favoritar e desfavoritar versículos.
    *   O sistema impede a duplicação de favoritos.
    *   A interface fornece feedback visual imediato (botão/estrela muda de cor) para indicar o status de favorito.
    *   Página dedicada para o usuário logado visualizar sua lista de versículos favoritos.
*   **Sugestão de Leitura Aleatória:** Sugestão de versículo que muda de acordo com o idioma/versão selecionado pelo usuário.

## Tecnologias e Bibliotecas Utilizadas

### Frontend
*   **React.js:** Biblioteca principal para a construção da interface do usuário.
*   **Hooks:** `useReducer` e `useContext` para gerenciamento de estado global.
*   **Bibliotecas Externas:**
    *   `react-router-dom`: Para criar a navegação entre as páginas (Busca, Favoritos) da SPA.
    *   `react-hook-form`: Para gerenciamento e validação do formulário de busca.

### Backend
*   **Node.js** com **Express.js:** Para a construção do servidor e da API RESTful.
*   **Knex.js:** Query Builder para interagir com o banco de dados de forma segura, prevenindo SQL Injection.
*   **SQLite3:** Sistema de gerenciamento de banco de dados leve e baseado em arquivo.
*   **Segurança e Otimização:**
    *   `jsonwebtoken` (JWT): Para gerar e verificar tokens de autenticação.
    *   `bcryptjs`: Para criptografar e comparar as senhas dos usuários.
    *   `cors`: Para permitir a comunicação segura entre frontend e backend.
    *   `compression`: Para comprimir as respostas do servidor, otimizando a performance.

### API Externa
*   **Nome:** Bible API (`https://bible-api.com/`)
*   **Uso:** Consumida pelo **backend** para buscar o texto de versículos específicos e sugestões aleatórias.

## Estrutura do Projeto

O projeto é um monorepo contendo duas pastas principais na raiz:

*   **`frontend/`**: Contém a aplicação React, com a estrutura de `src/components`, `src/contexts`, etc.
*   **`backend/`**: Contém o servidor Express, seguindo a estrutura de `src/config`, `src/models`, `src/routes`, conforme solicitado.

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