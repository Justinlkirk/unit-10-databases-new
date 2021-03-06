const { Pool } = require('pg');
const db = require('../models/starWarsModels');

const starWarsController = {};

starWarsController.getCharacters = (req, res, next) => {
  const queryString2 = 'SELECT p.*, w.name as homeworld, s.name as species FROM people p LEFT OUTER JOIN species s ON p.species_id = s._id LEFT OUTER JOIN planets w ON p.homeworld_id = w._id';

  db.query(queryString2)
    .then(data => data.rows)
    .then(async data => {
      // for (const char of data) {
      //   const charId = char._id;
      //   const queryString = `SELECT films.title FROM people_in_films INNER JOIN films ON films._id = people_in_films.film_id WHERE person_id = ${charId}`;
      //   await Promise.resolve(db.query(queryString).then(films => char.films = films.rows)); // {id: 1, name: Luke Skywalker... films: [A new Hope, ....]}
      // }
      res.locals.characters = data;
      next();
    }).catch((err) => next(err));
};

starWarsController.getSpecies = (req, res, next) => {
  // write code here
  const queryString = `SELECT s.name, s.classification, s.average_height, s.average_lifespan, s.language, p.name as homeworld FROM species s LEFT OUTER JOIN planets p On s.homeworld_id = p._id WHERE s._id = ${req.query.id}`;
  db.query(queryString)
    .then(data => res.locals.species = data.rows[0])
    .then(()=> next())
    .catch((err) => next(err));
};

starWarsController.getHomeworld = (req, res, next) => {
  const planetId = req.query.id;
  db.query(`SELECT planets.* FROM planets WHERE planets._id = ${planetId}`)
    .then((planetInfo) => res.locals.homeworld = planetInfo.rows[0])
    .then(() => next())
    .catch((err) => next(err));
};

starWarsController.getFilm = (req, res, next) => {
  // write code here

  next();
};

starWarsController.addCharacter = (req, res, next) => {
  // write code here
  const info = req.body;
  const lineOne = 'INSERT INTO people (name, mass, hair_color, skin_color, eye_color, birth_year, gender, height, species_id, homeworld_id)';
  const lineTwo = `VALUES ('${info.name}', ${info.mass}, '${info.hair_color}', '${info.skin_color}', '${info.eye_color}', '${info.birth_year}', '${info.gender}', ${info.height}, ${info.species_id}, ${info.homeworld_id})`; 
  const input = `${lineOne} ${lineTwo} RETURNING _id`;
  db.query(input)
    .then(async (personID)=>{
      console.log(personID);
      const id = personID.rows[0]._id;
      for(const film of info.films){
        await db.query(`INSERT INTO people_in_films (person_id, film_id) VALUES (${id}, ${film.id})`);
      }
    })
    .then(()=>next())
    .catch((err) => next(err));
};

starWarsController.deleteCharacter = (req, res, next) => {
  const requestId = Number(req.query.id);
  const queryStr = `DELETE FROM people WHERE _id = ${requestId}`;
  db.query(queryStr).then(() => next()).catch((err) => next(err));
};

module.exports = starWarsController;
