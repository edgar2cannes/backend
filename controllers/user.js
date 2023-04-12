//Import des modules nécessaires

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Import du modèle User
const User = require('../models/User');

//Fonction d'inscription d'un utilisateur
exports.signup = (req, res, next) => {
    //hashage du mot de passe de l'utilisateur
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //Création d'un nouvel utilisateur avec l'e-mail et le mot de passe hashé
            const user = new User({
                email: req.body.email,
                password: hash
            });
            //Enregistrement de l'utilsateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => {
                    console.log(error)

                    res.status(400).json({ error })
                });
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error })
        });

};

//Fonction de connexion d'un utilisateur
exports.login = (req, res, next) => {
    //Recherche de l'utilisateur dans la base de données avec son email
    User.findOne({ email: req.body.email })
        .then(user => {
            //Si l'utilisateur n'existe pas, renvoyer une erreur
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            //Comparaison du mot de passe saisi avec le mot de passe hashé stocké dans la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //Si les mots de passe ne correspondent pas,renvoyer une erreur
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    //Si les mots de passe correspondent , générer un token JWT pour l'utilisateur
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }

                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));

};
