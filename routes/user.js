//Importation de la bibliothèque Express
const express = require('express');

//Création d'un objet router pour gérer les routes
const router = express.Router();

//Importation du module de controleur pour l'utilisateur
const userCtrl = require('../controllers/user');

//Définition des routes pour l'authentification utilisateur

//Route pour s'inscrire
router.post('/signup', userCtrl.signup);

//Route pour se connecter
router.post('/login', userCtrl.login);

//Exportation du module de router
module.exports = router;