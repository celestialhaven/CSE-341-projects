const router = require('express').Router();
const mongodb = require('../data/database');

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
    console.error(error);
    res.status(500).json({
      message: 'Failed to get contacts',
      error: error.message
    });
  }
});

module.exports = router;