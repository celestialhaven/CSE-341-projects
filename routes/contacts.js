const router = require('express').Router();
const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

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

module.exports = router;