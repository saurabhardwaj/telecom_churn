const Joi = require('joi');

const editSchema = Joi.object({
  firstName: Joi.string().optional().label('First Name'),
  lastName: Joi.string().optional().label('Last Name'),
  email: Joi.string().email().optional().label('Email'),
});

module.exports = {
  editSchema
};
