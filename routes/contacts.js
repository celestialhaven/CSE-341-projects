const router = require('express').Router();
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const { asyncHandler, notFound } = require('../middleware/error');
const validation = require('../middleware/validate');

// Get all contacts
router.get('/', asyncHandler(async (req, res) => {
  const result = await mongodb
    .getDatabase()
    .db()
    .collection('contacts')
    .find();

  const contacts = await result.toArray();

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(contacts);
}));

// Get one contact by ID
router.get('/:id', validation.validateObjectId('Must use a valid contact id to find a contact.'), asyncHandler(async (req, res) => {
  const result = await mongodb
    .getDatabase()
    .db()
    .collection('contacts')
    .findOne({ _id: new ObjectId(req.params.id) });

  if (!result) {
    throw notFound('Contact not found');
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(result);
}));

router.post('/', validation.saveContact, asyncHandler(async (req, res) => {
  const result = await mongodb
    .getDatabase()
    .db()
    .collection('contacts')
    .insertOne(req.body);

  res.setHeader('Content-Type', 'application/json');
  res.status(201).json({ id: result.insertedId });
}));

// Update a contact by ID
router.put('/:id', validation.validateObjectId('Must use a valid contact id to update a contact.'), validation.saveContact, asyncHandler(async (req, res) => {
  const result = await mongodb
    .getDatabase()
    .db()
    .collection('contacts')
    .replaceOne({ _id: new ObjectId(req.params.id) }, req.body);

  if (result.matchedCount === 0) {
    throw notFound('Contact not found');
  }

  res.status(204).send();
}));

// Delete a contact by ID
router.delete('/:id', validation.validateObjectId('Must use a valid contact id to delete a contact.'), asyncHandler(async (req, res) => {
  const result = await mongodb
    .getDatabase()
    .db()
    .collection('contacts')
    .deleteOne({ _id: new ObjectId(req.params.id) });

  if (result.deletedCount === 0) {
    throw notFound('Contact not found');
  }

  res.status(204).send();
}));

module.exports = router;
