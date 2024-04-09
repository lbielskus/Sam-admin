import mongoose, { model, Schema, models } from 'mongoose';

const MediaSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  images: [{ type: String }],
  firstBanner: {
    type: Boolean,
    default: false,
  },
  secondBanner: {
    type: Boolean,
    default: false,
  },
  route: {
    type: String,
    default: '',
  },
});

export const Media = models.Media || model('Media', MediaSchema);
