const express = require('express');
const cors = require('cors');
const movies = require('./data/movies.json');
const users = require('./data/users.json');
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

server.post('/sign-up', (req, res) => {

  const email = req.query.email;
  const password = req.query.password;
  const query = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)");
  const result = query.run(email, password);
  res.json({
    "success": true,
    "userId": "nuevo-id-añadido"
  })
});


server.post('/login', (req, res) => {
  const email = req.query.email;
  const password = req.query.password;
  const query= db.prepare("SELECT * FROM users WHERE email=? AND password=?");
  const result = query.get(email, password);
  console.log(result);

  //if result === 
  //res.json({
  //  error: false,
  //  userId: result.lastInsertRowid,
 // });


})


server.get("/movie/:movieId", (req, res) => {
  const requestParamMovie = req.params.movieId;
  const foundMovie = movies.find((movie) => movie.id === requestParamMovie);
  console.log(foundMovie);
  res.render('movie', foundMovie);
});


const staticServerPathWeb = "./src/public-react";
server.use(express.static(staticServerPathWeb));

const staticServerPathImages = "./src/public-movies-images";
server.use(express.static(staticServerPathImages));
