# Desafio Técnico RealMate - API de Webhooks e Visualizador de Conversas

## Introdução

Este projeto foi desenvolvido como parte do desafio técnico da RealMate. O objetivo é uma API web construída com Django e Django Rest Framework que recebe e processa webhooks de um sistema de atendimento, registrando eventos de conversas e mensagens em um banco de dados SQLite. Adicionalmente, foi implementado um frontend bônus em React (com Vite, TypeScript, Tailwind CSS e shadcn/ui) para visualizar essas conversas e mensagens, incluindo atualizações automáticas via polling.

## Tecnologias Utilizadas

**Backend:**

- Python 3.x
- Django
- Django Rest Framework (DRF)
- Poetry (para gerenciamento de dependências)
- SQLite (banco de dados)

**Frontend:**

- Node.js (para o ambiente de desenvolvimento frontend)
- npm (ou yarn)
- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui (para componentes de UI)
- Axios (para chamadas API)
- React Router DOM (para navegação)

## Pré-requisitos

Antes de começar, garanta que você tem as seguintes ferramentas instaladas:

- Python (versão 3.8 ou superior recomendado)
- Poetry: [Instruções de instalação do Poetry](https://python-poetry.org/docs/#installation)
- Node.js (versão 18.x ou superior recomendado) e npm (que vem com o Node.js)

## Configuração e Execução do Projeto

O projeto é dividido em duas partes principais: `backend` e `frontend`. Execute os passos abaixo para cada uma.

### 1. Backend (API Django)

**Navegue para a pasta raiz do projeto onde o backend está localizado.** (`backend/`).

```bash
# 1. Instalar as dependências com Poetry:
poetry install

# 2. Aplicar as migrações no banco de dados SQLite:
# (Certifique-se que o ambiente virtual do Poetry está ativo, ou use 'poetry run')
poetry run python manage.py migrate

# 3. Executar o servidor de desenvolvimento do backend:
poetry run python manage.py runserver
```

O backend estará rodando em `http://localhost:8000` (ou outra porta se a 8000 estiver ocupada).

### 2. Frontend (Interface React)

**Navegue para a pasta do frontend** (`frontend/` ou o nome que você deu).

```bash
# cd frontend/

# 1. Instalar as dependências:
# (A flag --legacy-peer-deps é necessária devido a possíveis conflitos de dependências
#  entre as bibliotecas utilizadas, como shadcn/ui e suas dependências com as do React/Vite).
npm install --legacy-peer-deps

# 2. Executar o servidor de desenvolvimento do frontend:
npm run dev
```

O frontend estará rodando em `http://localhost:5173` (ou outra porta indicada pelo Vite).

**Importante sobre CORS:** O backend Django foi configurado com `django-cors-headers` para permitir requisições da origem do frontend (ex: `http://localhost:5173`). Se você rodar o frontend em uma porta diferente, pode ser necessário ajustar a configuração `CORS_ALLOWED_ORIGINS` no `settings.py` do backend.

## Funcionalidades Implementadas

- **Backend:**
  - Endpoint `POST /webhook/` para receber eventos:
    - `NEW_CONVERSATION`: Cria uma nova conversa.
    - `NEW_MESSAGE`: Adiciona uma mensagem a uma conversa existente e aberta.
    - `CLOSE_CONVERSATION`: Fecha uma conversa existente.
  - Endpoint `GET /conversations/` para listar todas as conversas (com dados resumidos).
  - Endpoint `GET /conversations/{id}/` para buscar detalhes de uma conversa específica, incluindo todas as suas mensagens.
  - Validação de dados e tratamento de erros conforme especificado.
- **Frontend (Bônus):**
  - Visualização da lista de conversas com status e data de início.
  - Visualização detalhada de cada conversa com suas mensagens, incluindo direção, conteúdo e timestamp.
  - Atualização automática da lista e dos detalhes da conversa via polling.
  - Datas formatadas para o padrão brasileiro (dd/mm/aaaa HH:MM:SS).
  - Interface construída com React, TypeScript, Vite, Tailwind CSS e componentes shadcn/ui.

## Endpoints da API (Resumo)

- `POST /webhook/`: Recebe eventos de webhook.
  - Exemplos de payload podem ser encontrados no README original do desafio.
- `GET /conversations/`: Retorna uma lista de todas as conversas.
- `GET /conversations/{uuid:id}/`: Retorna os detalhes de uma conversa específica, incluindo suas mensagens.

## Como Testar

1.  **Backend:**
    - Após iniciar o servidor backend, utilize uma ferramenta como o Postman. **Existe uma collection do Postman no repositório chamada `Realmate Dev Challenge.postman_collection.json` que contém exemplos de requisições para os diferentes tipos de payload de evento (`NEW_CONVERSATION`, `NEW_MESSAGE`, `CLOSE_CONVERSATION`). Importe esta collection no seu Postman para facilitar os testes no endpoint `http://localhost:8000/webhook/` e popular o banco de dados.**
    - Verifique também os endpoints `GET /conversations/` e `GET /conversations/{id}/` para confirmar se os dados estão sendo retornados corretamente.
2.  **Frontend:**
    - Após iniciar o servidor frontend, acesse `http://localhost:5173` (ou a porta indicada) no seu navegador.
    - A página inicial deve listar as conversas criadas via webhook.
    - Clique em uma conversa para ver seus detalhes e mensagens.
    - As atualizações (novas conversas ou mensagens criadas via webhook) devem refletir automaticamente nas páginas (lista e detalhe) devido ao polling implementado.
