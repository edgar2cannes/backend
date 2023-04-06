const Sauces = require('../models/Sauces');
const fs = require('fs');

exports.createSauces = (req, res, next) => {

    console.log(req.body)
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauces = new Sauces({
        ...sauceObject,
        userId: req.auth.userId,
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauces.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => {
            console.log(error)
            res.status(400).json({ error })
        })

};

exports.modifySauces = (req, res, next) => {
    ;
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauces),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauces.findOne({ _id: req.params.id })
        .then((sauces) => {
            if (sauces.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauces = (req, res, next) => {

    Sauces.findOne({ _id: req.params.id })
        .then(sauces => {
            if (sauces.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauces.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauces.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error });
        });
};

exports.getOneSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};


exports.likeSauces = (req, res, next) => {
    const userId = req.auth.userId;
    Sauces.findOne({ _id: req.params.id })
        .then(sauces => {
            if (req.body.like == 1) {
                sauces.likes++
                sauces.usersLiked.push(userId)
            }
            if (req.body.like == -1) {
                sauces.dislikes++
                sauces.usersDisliked.push(userId)
            }
            if (req.body.like == 0) {
                if (sauces.usersLiked.indexOf(userId) != -1) {
                    sauces.likes--
                    sauces.usersLiked.splice(sauces.usersLiked.indexOf(userId), 1)
                }
                else {
                    sauces.dislikes--
                    sauces.usersDisliked.splice(sauces.usersDisliked.indexOf(userId), 1)
                }
            }
            sauces.save()
            res.status(200).json({ message: 'like ok !' })
        })
        .catch(error => res.status(404).json({ error }));
};

