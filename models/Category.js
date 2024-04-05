const { Schema, model } = require('mongoose');

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Category' },
  imageUrl: { type: String },
});

const Category = model('Category', CategorySchema);

module.exports = Category;
