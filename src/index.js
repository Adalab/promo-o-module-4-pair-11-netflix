const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');
const users = require('./data/users.json');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//creacion de API
server.get('/movies', (req, res) => {
  const response = {
    success: true,
    movies: movies,

  };
  res.json(response);
});



server.post('/login', (req, res) => {

  const foundUser = users.find((user) => { return (user.email === req.body.userEmail && user.password === req.body.userPassword) });
  if (foundUser) {
    res.json({
      "success": true,
      "userId": "id_de_la_usuaria_encontrada"
    })
  } else {
    res.json({
      "success": false,
      "errorMessage": "Usuaria/o no encontrada/o"
    })
  }
})


const staticServerPathWeb = "./src/public-react";
server.use(express.static(staticServerPathWeb));

const staticServerPathImages = "./src/public-movies-images";
server.use(express.static(staticServerPathImages));
