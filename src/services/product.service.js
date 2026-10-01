const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const { uploadToCloudinary, deleteFromCloudinary } = require('./upload.service');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORT_MAP = { newest: '-createdAt', oldest: 'createdAt', price_asc: 'price', price_desc: '-price' };

const getAll = async ({ page, limit, search, category, minPrice, maxPrice, sort }) => {
  const filter = {};

  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: rx }, { description: rx }];
  }
  if (category) filter.category = category.toLowerCase();
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  const [items, total] = await Promise.all([
    Product.find(filter).sort(SORT_MAP[sort]).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter),
  ]);

  return { items, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

const getById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

const create = async (data, file, user) => {
  const image = file ? await uploadToCloudinary(file.path) : undefined;
  return Product.create({ ...data, image, createdBy: user.id });
};

// Only the owner (or an admin) may modify a product
const assertCanModify = (product, user) => {
  if (product.createdBy.toString() !== user.id && user.role !== 'admin') {
    throw new ApiError(403, 'You are not allowed to modify this product');
  }
};

const update = async (id, data, file, user) => {
  const product = await getById(id);
  assertCanModify(product, user);

  if (file) {
    const oldPublicId = product.image?.publicId;
    product.image = await uploadToCloudinary(file.path);
    await deleteFromCloudinary(oldPublicId);
  }

  Object.assign(product, data);
  await product.save();
  return product;
};

const remove = async (id, user) => {
  const product = await getById(id);
  assertCanModify(product, user);

  await product.deleteOne();
  await deleteFromCloudinary(product.image?.publicId);
};

module.exports = { getAll, getById, create, update, remove };
