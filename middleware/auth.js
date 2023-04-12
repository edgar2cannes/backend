
//Importation de la bibliothèque jsonwebtoken
const jwt = require('jsonwebtoken');

//Exportation du middleware d'authentification
module.exports = (req, res, next) => {
    try {
        //Récupération du jeton d'authentification dans les en-têtes de la demande
        const token = req.headers.authorization.split(' ')[1];

        //Décodage du jeton d'authentification avec la clé secrète
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

        //Récupération de l'identifiant de l'utilisateur à partir du jeton d'authentification décodé
        const userId = decodedToken.userId;

        //Ajout de l'identifiant de l'utilisateur à la demande
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        //Gestion des erreurs d'authentification
        res.status(401).json({ error });
    }
};