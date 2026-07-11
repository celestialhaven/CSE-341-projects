const router = require('express').Router();
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const requiredFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];

const getMissingFields = (body) => {
  return requiredFields.filter((field) => !body[field]);
};

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .find();

    const contacts = await result.toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get contacts',
      error: error.message
    });
  }
});

// Get one contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contactId = req.params.id;

    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({
        message: 'Invalid contact ID'
      });
    }

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .findOne({ _id: new ObjectId(contactId) });

    if (!result) {
      return res.status(404).json({
        message: 'Contact not found'
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get contact',
      error: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const missingFields = getMissingFields(req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields
      });
    }

    const contact = req.body;

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .insertOne(contact);

    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create contact',
      error: error.message
    });
  }
});

// Update a contact by ID
router.put('/:id', async (req, res) => {
  try {
    const contactId = req.params.id;

    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({
        message: 'Invalid contact ID'
      });
    }

    const missingFields = getMissingFields(req.body);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missingFields
      });
    }

    const contact = req.body;

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .replaceOne({ _id: new ObjectId(contactId) }, contact);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Contact not found'
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update contact',
      error: error.message
    });
  }
});

// Delete a contact by ID
router.delete('/:id', async (req, res) => {
  try {
    const contactId = req.params.id;

    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({
        message: 'Invalid contact ID'
      });
    }

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('contacts')
      .deleteOne({ _id: new ObjectId(contactId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Contact not found'
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete contact',
      error: error.message
    });
  }
});

module.exports = router;
