const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const { notFound } = require('../middleware/error');

const getAll = async (req, res) => { 
    //#swagger.tags=['Users]
    const result = await mongodb.getDatabase().db().collection('users').find();
    const users = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
}

const getSingle = async (req, res) => { 
    //#swagger.tags=['Users]
    const userId = new ObjectId(req.params.id);
    const user = await mongodb.getDatabase().db().collection('users').findOne({ _id: userId });

    if (!user) {
        throw notFound('User not found');
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);
}

const createUser = async (req, res) => {
    //#swagger.tags=['Users]
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const response = await mongodb.getDatabase().db().collection('users').insertOne(user);

    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({ id: response.insertedId });
};

const updateUser = async (req, res) => {
    //#swagger.tags=['Users]
    const userId = new ObjectId(req.params.id);
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        favoriteColor: req.body.favoriteColor,
        birthday: req.body.birthday
    };
    const response = await mongodb.getDatabase().db().collection('users').replaceOne({ _id: userId }, user);

    if (response.matchedCount === 0) {
        throw notFound('User not found');
    }

    res.status(204).send();
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['Users]
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });

    if (response.deletedCount === 0) {
        throw notFound('User not found');
    }

    res.status(204).send();
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
}
