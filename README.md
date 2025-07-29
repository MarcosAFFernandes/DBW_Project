# Um, Contra Todos – Jogo Multijogador

Jogo multijogador baseado na web desenvolvido em Node.js para a disciplina de Desenvolvimento Baseado na Web.

## Descrição do Projeto

O **Um, Contra Todos** é um jogo multijogador em tempo real onde os jogadores competem para responder a perguntas genéricas o mais rapidamente possível. O sistema inclui autenticação de utilizadores, salas de jogo, métricas de performance e comunicação em tempo real entre jogadores via WebSockets.

## Funcionalidades Principais

- Login/Registo de Utilizador com autenticação segura
- Jogo multijogador em tempo real (Socket.IO)
- Salas de jogo: criação e entrada em salas privadas
- Sistema de perguntas com respostas em simultâneo
- Métricas de performance: respostas certas/erradas, jogos realizados
- Perfil de utilizador com upload de imagem
- Sistema de validação com regex

## Tecnologias Utilizadas

- **Node.js** – Servidor principal
- **Express.js** – Framework web
- **Socket.IO** – Comunicação em tempo real
- **MongoDB** – Base de dados
- **Passport.js** – Autenticação
- **Multer** – Upload de imagens
- **EJS** – Templates
- **HTML/CSS/JavaScript** – Frontend

## Pré-requisitos

- Node.js 16.0 ou superior
- NPM 8.0 ou superior (Se não tiver instalado execute o comando npm install no terminal)
- MongoDB Atlas ou instância local

## Como Executar

- Escreva, no terminal, node index.js

## Como Visualizar

Após executar o comando, node index.js no terminal, abra o browser e aceda a [http://localhost:3000]