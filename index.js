let express = require("express");
let app = express();
//Socket IO setup///////
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");
const methodOverride = require("method-override");
//Passport variables
const passport = require("passport");
const localStrategy = require("passport-local");
const session = require("express-session");
const user = require("./model/userModel");
const PORT = 3000;

////
/**
 * Aqui vamos fazemos referencias de todas as rotas
 */
let userRoute = require("./routes/userRoute");

// Aqui chamamos a função que contém o socket
let serverSocket = require("./public/js/socket/socketServerSide");

app.set("view engine", "ejs"); //Estamos a dizer a noode.js que vamos user template engine .ejs
app.use(express.static(__dirname + "/public")); // é uma função middleware no framework Express.js para Node.js que serve arquivos estáticos, como imagens, arquivos CSS e JavaScript.
app.use(express.urlencoded({ extended: true })); // é uma função middleware do Express.js que é usada para analisar dados de formulários HTML que são enviados para o servidor. "express.urlencoded" é nativo de express. Podem também usar o body-parser como apresentado nos slides das aulas teóricos => https://www.npmjs.com/package/body-parser
app.use(express.json()); //Transforma JSON para objecto!
app.use(methodOverride("_method")); //Usar o method-override middleware para substituir POST request por PUT,PATCH ou DELETE, pois estes não existem no lado do cliente

//Express-session middleware
app.use(
  session({
    secret: "0000",
    resave: false,
    saveUninitialized: false,
  })
);

//PASSPORT CONFIG//////
app.use(passport.initialize()); //inicializa passport
app.use(passport.session()); ////é usado para restaurar uma sessão de utilizador. Isso permitirá que o website mantenha a autenticação do utilizador em todas as solicitações usando dados de sessão
passport.use(new localStrategy(user.authenticate())); //Authenticate é adicionado automaticamente pelo plugin
passport.serializeUser(user.serializeUser()); //guarda um utilizador na sessão
passport.deserializeUser(user.deserializeUser()); //retira um utilizador na sessão
require('dotenv').config();
mongoose
  .connect(
    process.env.MONGODB_URI,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("Successfully connected to database!"))
  .catch((err) => console.log("Database connection error: " + err));

// Function that calls and execute socket
serverSocket(io);

// Middleware que é executado sempre que fazemos, por exemplo, um get/post request
app.use(userRoute);
app.use('/uploads', express.static('uploads'));

server.listen(PORT, function (err) {
  if (err) console.log("Ups, something went wrong: " + err);
  else console.log("Listening at PORT " + PORT);
});


const connectedPlayers = {};
let gameStarted = false;
let roomID;

let playersScores = {};
const questions = [
  {
    question: "Qual é a data de fundação da UMa?",
    options: ["1986", "1988", "1990", "1992"],
    answer: 1,
  },
  {
    question: "Quantos alunos constituem a UMa?",
    options: ["4252", "4124", "3935", "3774"],
    answer: 3,
  },
  {
    question: "Quantas faculdades existem na UMa?",
    options: ["6", "7", "5", "8"],
    answer: 0,
  },
];

let currentQuestionPosition = 0;

// Handle socket connections
io.on("connection", (socket) => {
  // Create a room
  socket.on("createRoom", (room) => {
    console.log(`Created room ID: ${room}`);
    socket.join(room);
    socket.emit("roomCreated", room);
  });

  // Join a room
  socket.on("joinRoom", (player, roomId) => {
    console.log(`${player.username} joined room: ${roomId}`);
    roomID = roomId;
    socket.join(roomId);

    const players = Object.values(connectedPlayers);
    io.to(roomID).emit("reloadPlayersList", players);

    if (players.length >= 2 && !jogoIniciado) {
      io.emit("prepareGame");
    }
  });

  socket.on("playerReady", (roomID, player, imagem) => {
    const playerID = socket.id;
    const playerUsername = player;
    const playerImagem = imagem;
  
    console.log(`Player ${playerUsername} is ready!`);
  
    socket.username = playerUsername;
    socket.imagem = playerImagem;
    connectedPlayers[playerID] = { username: playerUsername, imagem: playerImagem };
  
    socket.join(roomID);
  
    const room = io.sockets.adapter.rooms.get(roomID);
    if (room) {
      const players = Array.from(room).map((socketID) => {
        const socketObj = io.sockets.sockets.get(socketID);
        return {
          username: socketObj.username,
          imagem: socketObj.imagem,
        };
      });
  
      io.to(roomID).emit("reloadPlayersList", players);
  
      if (players.length >= 2 && !gameStarted) {
        io.emit("prepareGame");
      }
    } else {
      console.log(`Room ${roomID} does not exist.`);
    }
  });

  // Handle messages in a room
  socket.on("message", (room, message) => {
    // Broadcast the message to everyone in the room
    io.to(room).emit("message", message);
  });

  // Leave a room
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  // Handle socket disconnections
  socket.on("disconnect", () => {
    if (socket.username) {
      const playerID = socket.id;
      const username = connectedPlayers[playerID].username;
      console.log(`Player ${username} left the room!`);
      delete connectedPlayers[playerID];

      const players = Object.values(connectedPlayers);
      io.to(roomID).emit("reloadPlayersList", players);
    }
  });

  socket.on("prepareGame", () => {
    gameStarted = true;
    startGame();
  });

  function startGame() {
    if (gameStarted) {
      const firstQuestion = questions[currentQuestionPosition];
      io.emit("showQuestion", firstQuestion);
    }
  }

  socket.on("answerQuestion", (answer) => {
    const playerID = socket.id;
    const username = connectedPlayers[playerID].username;

    const currentQuestion = questions[currentQuestionPosition];

    if (currentQuestion && currentQuestion.answer == answer) {
      if (!playersScores[username]) {
        playersScores[username] = 1;
      } else {
        playersScores[username]++;
      }
    }

    currentQuestionPosition++;

    if (currentQuestionPosition < questions.length) {
      const nextQuestion = questions[currentQuestionPosition];
      setTimeout(() => {
        io.emit("showQuestion", nextQuestion);
      }, 2000);
    } else {
      const winner = getWinner(playersScores);
      io.to(roomID).emit("showWinner", winner);
      gameStarted = false;
    }
  });
});

function getWinner(playersScores) {
  let winners = [];
  let maxScore = 0;

  for (const username in playersScores) {
    const score = playersScores[username];

    if (score > maxScore) {
      maxScore = score;
      winners = [username];
    } else if (score === maxScore) {
      winners.push(username);
    }
  }

  return winners;
}


