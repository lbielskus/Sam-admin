import mongoose, { model, Schema } from 'mongoose';

const BlogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: mongoose.Types.ObjectId, ref: 'Category' },
  createdAt: { type: Date, default: Date.now },
});

const BlogPost = mongoose.models.Blog || model('Blog', BlogSchema);

export default BlogPost;
