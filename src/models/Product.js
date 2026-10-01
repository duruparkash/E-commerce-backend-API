const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true, lowercase: true },
    stock: { type: Number, default: 0, min: 0 },
    image: {
      url: { type: String },
      publicId: { type: String }, // needed to delete/replace the image on Cloudinary later
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.image = ret.image?.url || null; // API exposes just the Cloudinary URL
        delete ret.__v;
        return ret;
      },
    },
  }
);

productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
