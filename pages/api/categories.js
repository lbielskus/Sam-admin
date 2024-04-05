import { mongooseConnect } from '../../lib/mongoose';
import { Category } from '../../models/Category';

export default async function handle(req, res) {
  const { method } = req;

  await mongooseConnect();

  try {
    if (method === 'POST') {
      const { name, parentCategory, imageUrl } = req.body;

      const categoryDoc = await Category.create({
        name,
        parent: parentCategory || undefined,
        imageUrl,
      });
      res.json(categoryDoc);
    }

    if (method === 'GET') {
      const categories = await Category.find().populate('parent');
      res.json(categories);
    }

    if (method === 'PUT') {
      const { name, parentCategory, _id } = req.body;

      const categoryDoc = await Category.findOneAndUpdate(
        { _id },
        { name, parent: parentCategory || undefined },
        { new: true }
      );
      res.json(categoryDoc);
    }

    if (method === 'DELETE') {
      const { _id } = req.query;
      await Category.deleteOne({ _id });
      res.json({ message: 'Category deleted successfully' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
