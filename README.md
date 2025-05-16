# TS - Frontend tarefas

Este repositório contém o frontend do teste técnico para a ts, desenvolvido em Next.js, React.

### Tecnologias Utilizadas

O projeto utiliza **Next.js** (React) para aproveitar renderização SSR, roteamento otimizado e melhor performance. O uso de **TypeScript** garante maior segurança e produtividade no código.

### Funcionalidades

- CRUD de tarefas (criar, listar, editar, excluir)
- Busca e filtro de tarefas
- Interface responsiva e feedback visual

### Como rodar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/ts-frontend.git
   cd ts-frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```


### Observações

- O backend (Laravel + Doctrine) está em outro repositório `https://github.com/ribeirosacarlos/ts-backend`.
- O frontend consome as rotas REST do backend para todas as operações de produto.
