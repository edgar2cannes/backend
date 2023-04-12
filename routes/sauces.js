//Importation de la bibliotheque Express
const express = require('express');

//Création d'un objet router pour gerer les routes
const router = express.Router();

//Importation d'un middlware pour l'authentification
const auth = require('../middleware/auth');

//Importation d'un middleware pour la gestion des fichiers
const multer = require('../middleware/multer-config');

//Importation du module de controleur pour les sauces
const saucesCtrl = require('../controllers/sauces');

//Définition des routes pour la gestion des sauces

//Route pour récuperer toutes les sauces
router.get('/', auth, saucesCtrl.getAllSauces);

//Route pour créer une nouvelle sauce
router.post('/', auth, multer, saucesCtrl.createSauces);

//Route pour liker une sauce
router.post('/:id/like', auth, saucesCtrl.likeSauces);

//Route pour récuperer une sauce en particulier
router.get('/:id', auth, saucesCtrl.getOneSauces);

//Route pour modifier une sauce existante
router.put('/:id', auth, multer, saucesCtrl.modifySauces);

//Route pour supprimer une sauce existante
router.delete('/:id', auth, saucesCtrl.deleteSauces);


//Exportation du module de router
module.exports = router;


