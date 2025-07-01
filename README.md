# Refrigério da Palavra (Aplicação Full-stack)

## Proposta do Projeto

O projeto "Refrigério da Palavra" é uma aplicação web full-stack desenvolvida como parte da disciplina de Programação Web Fullstack (ES47B-ES71). A aplicação implementa uma solução completa em 3 camadas: **Frontend (React.js)**, **Backend HTTP (Express.js)** e **Banco de Dados (SQLite)**.

O sistema permite que um usuário realize login para acessar funcionalidades personalizadas, como favoritar versículos e navegar continuamente entre eles. A busca de versículos é mediada por um backend próprio, que utiliza um banco de dados local para validar referências e permitir a navegação entre capítulos e livros, consumindo uma API externa apenas para obter o texto dos versículos.

## Arquitetura do Sistema

O projeto adota uma arquitetura de 3 camadas:

1.  **Frontend (React.js):** Interface do usuário construída como uma Single Page Application (SPA). Lida com a renderização, o estado da interface e a comunicação com o backend via requisições HTTPS.
2.  **Backend (Express.js):** Um servidor Node.js que expõe uma API RESTful segura. É responsável pela lógica de negócio, autenticação de usuários, e pela interação com o banco de dados e a API externa.
3.  **Banco de Dados (SQLite):** Armazena os dados da aplicação, incluindo usuários, versículos favoritos e a estrutura completa da Bíblia (livros, capítulos, contagem de versículos) para permitir funcionalidades avançadas.

## Funcionalidades Implementadas

*   **Autenticação de Usuário:** Sistema de login com validação de credenciais no backend e gerenciamento de sessão via Tokens JWT com tempo de expiração.
*   **Busca e Navegação Inteligente:**
    *   Formulário de busca flexível que permite a inserção de nomes de livros com variações (ex: "Joao", "joão").
    *   Backend valida a existência do livro, capítulo e versículo no banco de dados local.
    *   Implementação de botões "Próximo" e "Anterior" que permitem navegar continuamente entre versículos, capítulos e até mesmo entre livros.
*   **Sistema de Favoritos:**
    *   Usuários logados podem favoritar e desfavoritar versículos.
    *   O sistema impede a duplicação de favoritos e fornece feedback visual imediato (botão/estrela muda de cor).
    *   Página dedicada para o usuário logado visualizar e gerenciar sua lista de versículos favoritos.
*   **Sugestão de Leitura Aleatória:** Sugestão de versículo que muda de acordo com o idioma/versão selecionado pelo usuário.

## Tecnologias e Boas Práticas (Critérios de Avaliação)

### Frontend
*   **React.js:** Biblioteca principal para a construção da interface do usuário.
*   **Hooks:** `useReducer` e `useContext` para gerenciamento de estado global.
*   **Bibliotecas Externas:**
    *   `react-router-dom`: Para criar a navegação da SPA, configurada com `basename` para funcionar em desenvolvimento e produção.
    *   `react-hook-form`: Para gerenciamento e validação do formulário de busca.

### Backend
*   **Node.js** com **Express.js:** Para a construção do servidor e da API RESTful.
*   **Banco de Dados:** **SQLite3** com **Knex.js** como Query Builder, que previne ataques de SQL Injection. O **Pool de Conexões** foi configurado explicitamente no `knexfile.js`.
*   **Segurança:**
    *   **HTTPS:** O servidor Express roda com um certificado SSL auto-assinado para desenvolvimento seguro.
    *   **Criptografia de Senhas:** A biblioteca `bcryptjs` é utilizada para gerar hash e comparar senhas.
    *   **Autenticação:** Gerenciamento de sessão com **Tokens JWT** (`jsonwebtoken`) e rotas protegidas por middleware.
    *   **Sanitizers:** O middleware `express-xss-sanitizer` é usado para prevenir ataques de Cross-Site Scripting.
    *   **Rate Limiting:** `express-rate-limit` é usado para proteger contra ataques de força bruta.
*   **Otimização e Monitoramento:**
    *   **Compressão:** O middleware `compression` é usado para comprimir respostas da API com GZIP.
    *   **Cache:** Uma estratégia de cache em memória com TTL foi implementada para a rota de sugestões.
    *   **Logs:** `morgan` e `winston` são usados para registrar requisições e erros em arquivos, garantindo o monitoramento.
*   **Validação:** A biblioteca `celebrate` (Joi) é usada para validar os dados de entrada em todas as rotas relevantes.

## Como Executar o Projeto Localmente

**Pré-requisitos:** Node.js, npm e OpenSSL (geralmente incluído no Git para Windows).

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/AlisonCarv/Refrigerio.git
    cd Refrigerio
    ```

2.  **Configure e Inicie o Backend:**
    *   Navegue até a pasta do backend: `cd backend`.
    *   Instale as dependências: `npm install`.
    *   Execute as migrations e seeds para criar e popular o banco de dados:
        ```bash
        npm run knex:migrate
        npm run knex:seed
        ```
    *   Inicie o servidor do backend. Na primeira vez, ele gerará o certificado SSL automaticamente:
        ```bash
        npm start
        ```
        (O servidor rodará em `https://localhost:3001`).

3.  **Configure e Inicie o Frontend:**
    *   Abra um **novo terminal**.
    *   Navegue até a pasta do frontend: `cd frontend`.
    *   Instale as dependências: `npm install`.
    *   Inicie a aplicação React:
        ```bash
        npm start
        ```

4.  **Acesse a Aplicação:**
    *   Seu navegador abrirá em `https://localhost:3000/Refrigerio`.
    *   Você verá um aviso de segurança devido ao certificado auto-assinado. Clique em **"Avançado"** e depois em **"Ir para localhost (não seguro)"**.
    *   Use as credenciais `admin` / `admin` para fazer o login.

## Aluno
*   **Nome:** Álison Christian Rebouças Vidal de Carvalho
*   **RA:** 2565765