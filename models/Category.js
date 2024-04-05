import mongoose, { model, Schema, models } from 'mongoose';

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  imageUrl: {
    type: String,
  },
});

export const Category = models.Category || model('Category', categorySchema);
