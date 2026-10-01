const productService = require('../services/product.service');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

const getAll = asyncHandler(async (req, res) => {
  const { items, pagination } = await productService.getAll(req.query);
  res.status(200).json({ success: true, message: 'Products fetched successfully', data: items, pagination });
});

const getOne = asyncHandler(async (req, res) => {
  const product = await productService.getById(req.params.id);
  sendSuccess(res, 200, 'Product fetched successfully', { product });
});

const create = asyncHandler(async (req, res) => {
  const product = await productService.create(req.body, req.file, req.user);
  sendSuccess(res, 201, 'Product created successfully', { product, imageUrl: product.image?.url || null });
});

const update = asyncHandler(async (req, res) => {
  if (!req.file && Object.keys(req.body).length === 0) {
    throw new ApiError(400, 'Provide at least one field or an image to update');
  }
  const product = await productService.update(req.params.id, req.body, req.file, req.user);
  sendSuccess(res, 200, 'Product updated successfully', { product, imageUrl: product.image?.url || null });
});

const remove = asyncHandler(async (req, res) => {
  await productService.remove(req.params.id, req.user);
  sendSuccess(res, 200, 'Product deleted successfully');
});

module.exports = { getAll, getOne, create, update, remove };
