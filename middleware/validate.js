const { ObjectId } = require('mongodb');
const validator = require('../helpers/validate');

const validateObjectId = (message, paramName = 'id') => {
  return (req, res, next) => {
    if (!ObjectId.isValid(req.params[paramName])) {
      return res.status(400).json(message);
    }

    next();
  };
};

const savePerson = (req, res, next) => {
  const validationRule = {
    firstName: 'required|string',
    lastName: 'required|string',
    email: 'required|email',
    favoriteColor: 'required|string',
    birthday: 'required|string'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    }

    next();
  });
};

module.exports = {
  saveContact: savePerson,
  saveUser: savePerson,
  validateObjectId
};
