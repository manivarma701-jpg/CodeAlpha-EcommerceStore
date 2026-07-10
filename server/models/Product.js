const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, required: true, min: 0 }, // "market price" shown struck-through, price is the sale price
    image: { type: String, required: true },
    category: { type: String, required: true, index: true },
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 4.2, min: 0, max: 5 }
  },
  { timestamps: true }
);

ProductSchema.virtual('discountPercent').get(function () {
  if (!this.mrp || this.mrp <= this.price) return 0;
  return Math.round(((this.mrp - this.price) / this.mrp) * 100);
});

ProductSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
