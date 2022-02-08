const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');
// const users = require('./data/users.json');
const Database = require('better-sqlite3');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());
server.set("view engine", "ejs");

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// init and config data base
const db = new Database('./src/db/database.db', {
  // this line log in console all data base queries
  verbose: console.log
});


//creacion de API
server.get('/movies', (req, res) => {
  const gender = req.query.gender;
  const sort = req.query.sort;

  if (!gender || !sort) {
    const query = db.prepare(`SELECT * FROM movies ORDER BY title ${sort}`);
    const movies = query.all();
    const response = {
      success: true,
      movies: movies,

    };
    res.json(response);

  } else {
    const query = db.prepare(`SELECT * FROM movies WHERE gender = ? ORDER BY title ${sort}`);
    const movies = query.all(gender);
    const response = {
      success: true,
      movies: movies,

    };
    res.json(response);
  }

});

server.post('/signup', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  // console.log("ESTE ES EL BODY", req.body);
  const selectuser = db.prepare('SELECT * FROM users WHERE email = ?');
  const foundUser = selectuser.get(email);
  // console.log(foundUser);
  if (foundUser === undefined) {
    const query = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    const result = query.run(email, password);
    res.json({
      "success": true,
      userId: result.id,
    });
  } else {
    res.json({
      "success": false,
      "errorMessage": "Usuaria/o no encontrada/o"
    });
  }
});


server.post('/login', (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const query = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
  const result = query.get(email, password);
  if (result !== undefined) {
    res.json({
      "success": true,
      userId: result.id
    });
  } else {
    res.json({
      "success": false,
      "errorMessage": "Usuaria/o no encontrada/o"
    });
  }
})


server.get("/movie/:movieId", (req, res) => {
  const requestParamMovie = req.params.movieId;
  const query = db.prepare(`SELECT * FROM movies WHERE id = ? `);
  const movie = query.get(requestParamMovie);
  res.render('movie', movie);
});


const staticServerPathWeb = "./src/public-react";
server.use(express.static(staticServerPathWeb));

const staticServerPathImages = "./src/public-movies-images";
server.use(express.static(staticServerPathImages));
