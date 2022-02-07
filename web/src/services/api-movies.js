// login

const getMoviesFromApi = (data) => {
  console.log(data);
  console.log('Se están pidiendo las películas de la app');
  // CAMBIA ESTE FETCH PARA QUE APUNTE A UN ENDPOINT DE TU SERVIDOR, PIENSA SI DEBE SER GET O POST, PIENSA QUÉ DATOS DEBES ENVIAR, ETC
  // create query params
  const queryParams = `?gender=${data.gender}&sort=${data.sort}`;

  return fetch('http://localhost:4000/movies' + queryParams, { method: 'GET' })
    .then(response => response.json())
    .then((dataMovies) => {
      // CAMBIA EL CONTENIDO DE ESTE THEN PARA GESTIONAR LA RESPUESTA DEL SERVIDOR Y RETORNAR AL COMPONENTE APP LO QUE NECESITA
      return dataMovies;
    });
};

const objToExport = {
  getMoviesFromApi: getMoviesFromApi
};

export default objToExport;
