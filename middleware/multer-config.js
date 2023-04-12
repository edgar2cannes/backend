//Importation de la bibliotheque multer
const multer = require('multer');

//Types MIME acceptés pour les fichiers images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//Configuration du stockage des fichiers image
const storage = multer.diskStorage({
    //Emplacement de stockage des fichiers image
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    //Nom du fichier image après téléchargement
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

//Exportation du middleware multer configuré
module.exports = multer({ storage: storage }).single('image');


