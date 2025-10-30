# Projeto-extIV  
Sistema desenvolvido com stack JavaScript/TypeScript front-end (ex: React+Vite) para criação de um sistema de Registro e Monitoramento de alunos 

## 📌 Visão Geral  
Este projeto consiste em uma aplicação web para (descrever o que faz: ex: gerenciar dados, interface de usuário, operações CRUD, etc).  
Utiliza tecnologias modernas (ex: React, Vite, TailwindCSS) para oferecer uma experiência rápida e responsiva.

## 🛠️ Funcionalidades Principais  
- Interface de usuário reativa para (ex: listagem, cadastro, edição, exclusão) de itens/entities.  
- Integração com base de dados local (ex: arquivo `db.json` ou API simulada).  
- Estilização responsiva com TailwindCSS.  
- Build rápido e moderno com Vite.  
- Possibilidade de extender ou adaptar para backend real ou API externa.

## 📁 Estrutura do Projeto  
```
/Projeto-extIV  
│  db.json                  ← base de dados simples ou mock  
│  package.json             ← dependências e scripts  
│  vite.config.js           ← configuração do Vite  
│  tailwind.config.js       ← configuração do TailwindCSS  
│  eslint.config.js         ← configuração ESLint  
└─ src/                     ← código-fonte  
   ├─ (componentes/)        ← componentes React ou equivalentes  
   ├─ (pages/)              ← páginas ou views  
   └─ (assets/, styles/)     ← arquivos de estilo, imagens, etc  
```

## 🎯 Tecnologias Utilizadas  
- JavaScript ou TypeScript (dependendo da versão)  
- React (ou outro framework front-end que estiver usando)  
- Vite para build e desenvolvimento rápido  
- TailwindCSS para estilização  
- (Opcionalmente) `db.json` como mock de base de dados ou arquivo de dados estático  
- (Opcional) ESLint para linting e qualidade de código  

## 🚀 Como Executar o Projeto  
1. Clone o repositório:  
   ```bash
   git clone https://github.com/RogersonFelipe/Projeto-extIV.git
   ```  
2. Acesse a pasta do projeto:  
   ```bash
   cd Projeto-extIV
   ```  
3. Instale as dependências:  
   ```bash
   npm install
   ```  
   ou  
   ```bash
   yarn install
   ```  
4. Inicie em modo de desenvolvimento:  
   ```bash
   npm run dev
   ```  
   ou  
   ```bash
   yarn dev
   ```  
5. Acesse no navegador: normalmente `http://localhost:3000` (ou porta definida).  
6. Para build de produção:  
   ```bash
   npm run build
   ```  
   ou  
   ```bash
   yarn build
   ```  
7. (Opcional) Servir o build:  
   ```bash
   npm run serve
   ```  
   ou conforme script definido no `package.json`.

## ✅ Boas Práticas e Considerações  
- Mantenha os componentes pequenos e reutilizáveis.  
- Use estados e hooks (se for React) de forma clara e legível.  
- Separe lógica de apresentação da lógica de negócio.  
- Valide entradas de usuário e trate erros de forma amigável.  
- Use linting/formatting para manter estilo consistente (ex: ESLint + Prettier).  
- Considere testes unitários ou de integração para componentes críticos.

## 📋 Possíveis Melhorias Futuras  
- Conectar a uma API backend real (ex: Node.js, Express, banco de dados remoto)  
- Implementar autenticação de usuário (login/logout, controle de acesso)  
- Implementar rotas privadas ou controle de navegação baseado em permissões  
- Adicionar testes automatizados (ex: Jest, React Testing Library)  
- Adicionar deploy contínuo (ex: Netlify, Vercel, GitHub Pages)  
- Melhorar a experiência do usuário com transições animadas, feedbacks, etc.

## 👤 Autores  
**Rogerson Felipe**  
- 🧑‍💻 GitHub: [https://github.com/RogersonFelipe](https://github.com/RogersonFelipe)   
**Alessandro Graciano**
**Gustavo M. Cesconetto** 
## 📄 Licença  
Este projeto está licenciado sob a **MIT License** — você pode estudá-lo, modificá-lo e utilizá-lo livremente, desde que mantenha os créditos.

---
