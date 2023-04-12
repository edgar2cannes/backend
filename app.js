//Import des modules nécessaires
const path = require('node:path');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();


//Import du module Mongoose pour interargir avec la base de données MongoDB
const mongoose = require('mongoose');

//On importe les routes pour les sauces et les utilisateurs
const saucesRoutes = require('./routes/sauces');

const userRoutes = require('./routes/user');

//Connexion à la base de données MongoDB via une URL de connexion
mongoose.connect('mongodb+srv://ed:Mawandza03@cluster.p4kelc3.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//On crée notre application Express
const app = express();

//On définit les entêtes pour permettre les requêtes cross-domain
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use(express.json());

//On déclare les routes pour les utilisateurs et les sauces
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

//On permet d'acceder aux images via une URL statique
app.use('/images', express.static(path.join(__dirname, 'images')));



module.exports = app;