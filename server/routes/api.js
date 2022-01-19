const express = require('express');

const starWarsController = require('../controllers/starWarsController');

const router = express.Router();

router.get('/',
  starWarsController.getCharacters,
  (req, res) => res.status(200).json(res.locals.characters)
);

router.get('/species',
  starWarsController.getSpecies,
  (req, res) => {
    console.log('*** SPECIES GET REQUEST ***');
    console.log(res.locals.species);
    res.status(200).json(res.locals.species);
    
  }// object 
);

router.get('/homeworld',
  starWarsController.getHomeworld,
  (req, res) => res.status(200).json({})
);

router.get('/film',
  starWarsController.getFilm,
  (req, res) => res.status(200).json({})
);

router.post('/character',
  starWarsController.addCharacter,
  (req, res) => res.status(200).json({})
);

module.exports = router;
