# Refrigério da Palavra

## Proposta do Projeto

O projeto "Refrigério da Palavra" é uma aplicação web frontend desenvolvida como parte da disciplina de Programação Web Fullstack (ES47B-ES71). O objetivo principal é construir uma Single Page Application (SPA) utilizando React.js e AJAX para consumir dados de uma API JSON pública de conteúdo bíblico.

A aplicação permite aos usuários selecionar um idioma e, com base nele, uma versão da Bíblia. Em seguida, os usuários podem buscar versículos específicos informando o livro, capítulo e versículo desejados. Além disso, a aplicação apresenta uma sugestão de leitura aleatória, que é atualizada conforme o idioma/versão selecionada.

Este projeto avalia a capacidade de desenvolver uma interface cliente com React.js, gerenciar o estado da aplicação, realizar requisições assíncronas para consumir e exibir dados de uma API JSON, e implementar funcionalidades específicas do React, como hooks e o uso de bibliotecas externas.

## Funcionalidades Implementadas

*   **Seleção de Idioma e Versão:**
    *   O usuário pode escolher entre os idiomas Português (versão Almeida) e Inglês (versão World English Bible - WEB).
    *   A seleção do idioma define automaticamente a versão da Bíblia a ser utilizada nas buscas e sugestões.
*   **Busca de Versículos:**
    *   Formulário para o usuário inserir o nome do Livro, número do Capítulo e número do Versículo.
    *   Validação de campos obrigatórios.
    *   Exibição do texto do versículo encontrado e sua referência.
    *   Apresentação de mensagens de erro caso a busca falhe ou o versículo não seja encontrado.
*   **Sugestão de Leitura Aleatória:**
    *   Ao carregar a página e sempre que o idioma/versão é alterado, uma sugestão de versículo aleatório é buscada e exibida.
    *   Apresenta o texto do versículo e sua respectiva referência.
*   **Interface de Página Única (SPA):**
    *   Todas as funcionalidades são implementadas em uma única página HTML, sem redirecionamentos, com atualizações dinâmicas da interface.

## Tecnologias e APIs Utilizadas

### 1. API JSON Aberta
*   **Nome da API:** Bible API
*   **URL Base:** `https://bible-api.com/`
*   **Endpoints Utilizados:**
    *   Para busca de versículos específicos (User Input): `/:livro+:capitulo::versiculo?translation=:versao`
        *   Exemplo: `https://bible-api.com/Joao+3:16?translation=almeida`
    *   Para sugestão de versículo aleatório (Parameterized API): `/data/:versao/random`
        *   Exemplo: `https://bible-api.com/data/almeida/random`
*   **Descrição:** Esta API fornece acesso a textos bíblicos em diversas traduções, permitindo buscas por referências específicas e a obtenção de versículos aleatórios.

### 2. Hook ou Funcionalidade do React.js Selecionado
*   **Hook:** `useReducer` (em conjunto com `useContext`)
*   **Descrição:** O hook `useReducer` é utilizado para gerenciar o estado global da aplicação de forma centralizada. Ele lida com o idioma selecionado, a versão da Bíblia, os dados da busca (livro, capítulo, versículo, texto resultante), a sugestão de leitura, e os estados de carregamento e erro das requisições à API. O `useContext` é usado para prover esse estado e a função `dispatch` para os componentes que necessitam deles.

### 3. Biblioteca Externa Utilizada com React.js
*   **Nome da Biblioteca:** React Hook Form
*   **URL:** `https://react-hook-form.com/`
*   **Descrição:** A biblioteca `React Hook Form` é utilizada para gerenciar o formulário de busca de versículos. Ela simplifica o processo de registro dos campos, validação (como campos obrigatórios e formato numérico para capítulo/versículo) e o tratamento da submissão do formulário, além de otimizar o desempenho ao reduzir re-renderizações desnecessárias.

## Estrutura do Projeto

O código-fonte da aplicação está organizado da seguinte forma dentro da pasta `src/`:

*   `src/components/`: Contém todos os componentes React escritos em JSX, responsáveis pela interface do usuário.
*   `src/contexts/`: Contém o contexto React (`EstadoBibliaContexto.js`) utilizado para o gerenciamento de estado global com `useReducer`.
*   `src/App.css`: Arquivo de estilos CSS global para a aplicação.
*   `src/App.jsx`: Componente principal que estrutura a aplicação.
*   `src/index.js`: Ponto de entrada da aplicação React.

## Como Executar o Projeto Localmente

1.  Clone este repositório:
    ```bash
    git clone https://github.com/AlisonCarv/Refrigerio.git
    ```
2.  Navegue até a pasta do projeto:
    ```bash
    cd Refrigerio
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```
    ou
    ```bash
    yarn install
    ```
4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm start
    ```
    ou
    ```bash
    yarn start
    ```
A aplicação estará disponível em `http://localhost:3000`.

## Aluno
*   **Nome:** Álison Christian Rebouças Vidal de Carvalho
*   **RA:** 2565765# Refrigério da Palavra

## Proposta do Projeto

O projeto "Refrigério da Palavra" é uma aplicação web frontend desenvolvida como parte da disciplina de Programação Web Fullstack (ES47B-ES71). O objetivo principal é construir uma Single Page Application (SPA) utilizando React.js e AJAX para consumir dados de uma API JSON pública de conteúdo bíblico.

A aplicação permite aos usuários selecionar um idioma e, com base nele, uma versão da Bíblia. Em seguida, os usuários podem buscar versículos específicos informando o livro, capítulo e versículo desejados. Além disso, a aplicação apresenta uma sugestão de leitura aleatória, que é atualizada conforme o idioma/versão selecionada.

Este projeto avalia a capacidade de desenvolver uma interface cliente com React.js, gerenciar o estado da aplicação, realizar requisições assíncronas para consumir e exibir dados de uma API JSON, e implementar funcionalidades específicas do React, como hooks e o uso de bibliotecas externas.

## Funcionalidades Implementadas

*   **Seleção de Idioma e Versão:**
    *   O usuário pode escolher entre os idiomas Português (versão Almeida) e Inglês (versão World English Bible - WEB).
    *   A seleção do idioma define automaticamente a versão da Bíblia a ser utilizada nas buscas e sugestões.
*   **Busca de Versículos:**
    *   Formulário para o usuário inserir o nome do Livro, número do Capítulo e número do Versículo.
    *   Validação de campos obrigatórios.
    *   Exibição do texto do versículo encontrado e sua referência.
    *   Apresentação de mensagens de erro caso a busca falhe ou o versículo não seja encontrado.
*   **Sugestão de Leitura Aleatória:**
    *   Ao carregar a página e sempre que o idioma/versão é alterado, uma sugestão de versículo aleatório é buscada e exibida.
    *   Apresenta o texto do versículo e sua respectiva referência.
*   **Interface de Página Única (SPA):**
    *   Todas as funcionalidades são implementadas em uma única página HTML, sem redirecionamentos, com atualizações dinâmicas da interface.

## Tecnologias e APIs Utilizadas

### 1. API JSON Aberta
*   **Nome da API:** Bible API
*   **URL Base:** `https://bible-api.com/`
*   **Endpoints Utilizados:**
    *   Para busca de versículos específicos (User Input): `/:livro+:capitulo::versiculo?translation=:versao`
        *   Exemplo: `https://bible-api.com/Joao+3:16?translation=almeida`
    *   Para sugestão de versículo aleatório (Parameterized API): `/data/:versao/random`
        *   Exemplo: `https://bible-api.com/data/almeida/random`
*   **Descrição:** Esta API fornece acesso a textos bíblicos em diversas traduções, permitindo buscas por referências específicas e a obtenção de versículos aleatórios.

### 2. Hook ou Funcionalidade do React.js Selecionado
*   **Hook:** `useReducer` (em conjunto com `useContext`)
*   **Descrição:** O hook `useReducer` é utilizado para gerenciar o estado global da aplicação de forma centralizada. Ele lida com o idioma selecionado, a versão da Bíblia, os dados da busca (livro, capítulo, versículo, texto resultante), a sugestão de leitura, e os estados de carregamento e erro das requisições à API. O `useContext` é usado para prover esse estado e a função `dispatch` para os componentes que necessitam deles.

### 3. Biblioteca Externa Utilizada com React.js
*   **Nome da Biblioteca:** React Hook Form
*   **URL:** `https://react-hook-form.com/`
*   **Descrição:** A biblioteca `React Hook Form` é utilizada para gerenciar o formulário de busca de versículos. Ela simplifica o processo de registro dos campos, validação (como campos obrigatórios e formato numérico para capítulo/versículo) e o tratamento da submissão do formulário, além de otimizar o desempenho ao reduzir re-renderizações desnecessárias.

## Estrutura do Projeto

O código-fonte da aplicação está organizado da seguinte forma dentro da pasta `src/`:

*   `src/components/`: Contém todos os componentes React escritos em JSX, responsáveis pela interface do usuário.
*   `src/contexts/`: Contém o contexto React (`EstadoBibliaContexto.js`) utilizado para o gerenciamento de estado global com `useReducer`.
*   `src/App.css`: Arquivo de estilos CSS global para a aplicação.
*   `src/App.jsx`: Componente principal que estrutura a aplicação.
*   `src/index.js`: Ponto de entrada da aplicação React.

## Como Executar o Projeto Localmente

1.  Clone este repositório:
    ```bash
    git clone https://github.com/AlisonCarv/Refrigerio.git
    ```
2.  Navegue até a pasta do projeto:
    ```bash
    cd Refrigerio
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```
    ou
    ```bash
    yarn install
    ```
4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm start
    ```
    ou
    ```bash
    yarn start
    ```
A aplicação estará disponível em `http://localhost:3000`.

## Aluno
*   **Nome:** Álison Christian Rebouças Vidal de Carvalho
*   **RA:** 2565765
