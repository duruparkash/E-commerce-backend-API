const Joi = require('joi');

const createProductSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().trim().max(1000).allow('').default(''),
  price: Joi.number().min(0).required(),
  category: Joi.string().trim().min(2).max(50).required(),
  stock: Joi.number().integer().min(0).default(0),
});

// All fields optional on update (partial update)
const updateProductSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  description: Joi.string().trim().max(1000).allow(''),
  price: Joi.number().min(0),
  category: Joi.string().trim().min(2).max(50),
  stock: Joi.number().integer().min(0),
});

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().max(100),
  category: Joi.string().trim().max(50),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(Joi.ref('minPrice')),
  sort: Joi.string().valid('newest', 'oldest', 'price_asc', 'price_desc').default('newest'),
});

module.exports = { createProductSchema, updateProductSchema, listQuerySchema };
