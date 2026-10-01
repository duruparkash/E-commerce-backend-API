const fs = require('fs');
const cloudinary = require('../config/cloudinary');

// Step 2: temp file on server -> Cloudinary -> URL. Temp file is always removed afterwards.
const uploadToCloudinary = async (localPath) => {
  try {
    const result = await cloudinary.uploader.upload(localPath, { folder: 'ecommerce/products' });
    return { url: result.secure_url, publicId: result.public_id };
  } finally {
    await fs.promises.unlink(localPath).catch(() => {}); // fs: delete temp file
  }
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete failed:', err.message);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
