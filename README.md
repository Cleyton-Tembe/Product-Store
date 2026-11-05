# Product Store

Aplicação MERN para gerir uma lista de produtos: criar, ver, editar e apagar.

> **Âmbito do projecto:** este é um projecto de estudo. Fi-lo para me familiarizar com a stack MERN (MongoDB, Express, React e Node.js), o Chakra UI e o Zustand, e para pôr em prática a criação de uma API REST com CRUD completo. Não é um produto final.

## Demo

🔗 **[Ver demo](https://product-store-dpux.onrender.com)**

## Funcionalidades

- Listagem de todos os produtos em cartões, com nome, preço e imagem
- Criação de produtos com upload de imagem (JPG, PNG ou WebP, até 2 MB) e validação dos campos
- Edição de produtos numa janela modal
- Remoção de produtos
- Notificações (toasts) de sucesso e de erro
- Modo claro e escuro
- Estado global da aplicação com Zustand
- Em produção, o próprio servidor Express serve o front-end compilado

## Tecnologias

| Front-end | Back-end |
|---|---|
| React 19 + Vite | Node.js + Express 5 |
| Chakra UI + Framer Motion | MongoDB + Mongoose |
| Zustand | dotenv, cors |
| React Router | nodemon (desenvolvimento) |

## API

| Método | Rota | Acção |
|---|---|---|
| GET | `/api/products/All` | Lista todos os produtos |
| POST | `/api/products` | Cria um produto |
| PATCH | `/api/products/update/:id` | Actualiza um produto |
| DELETE | `/api/products/delete/:id` | Apaga um produto |

## Como correr localmente

### Pré-requisitos

- **Node.js 20 ou superior**
- Uma base de dados **MongoDB** (local ou [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clonar o repositório

```bash
git clone https://github.com/Cleyton-Tembe/Product-Store.git
cd Product-Store
```

### 2. Variáveis de ambiente

Cria um ficheiro `.env` na raiz do projecto:

```env
PORT=4000
MONGO_URL=mongodb+srv://<utilizador>:<password>@<cluster>/<base-de-dados>
```

### 3. Arrancar o back-end

Na raiz do projecto:

```bash
npm install
npm run dev
```

A API fica em `http://localhost:4000`.

### 4. Arrancar o front-end

Noutro terminal:

```bash
cd FrontEnd/Product-Front-End
npm install
npm run dev
```

Abre `http://localhost:5173`. Os pedidos a `/api` são reencaminhados para a porta 4000.

### Correr em modo de produção

```bash
npm run build   # instala as dependências e compila o front-end
npm start       # o Express serve a API e o front-end
```

## Autor

**Cleyton Tembe** — [GitHub](https://github.com/Cleyton-Tembe)
