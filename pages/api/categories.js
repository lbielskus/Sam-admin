import { mongooseConnect } from '../../lib/mongoose';
import { Category } from '../../models/Category';

export default async function handle(req, res) {
  const { method } = req;

  await mongooseConnect();

  try {
    if (method === 'POST') {
      const { name, parentCategoryId, imageUrl } = req.body;

      const categoryDoc = await Category.create({
        name,
        parent: parentCategoryId ? parentCategoryId : null,
        imageUrl, // Save the imageUrl in the database
      });
      res.json(categoryDoc);
    }

    if (method === 'GET') {
      if (req.query?.id) {
        res.json(
          await Category.findOne({ _id: req.query.id }).populate('parent')
        );
      } else {
        const categories = await Category.find().populate('parent');
        res.json(categories);
      }
    }

    if (method === 'PUT') {
      const { name, parentCategoryId, _id, imageUrl } = req.body;

      const categoryDoc = await Category.findOneAndUpdate(
        { _id },
        { name, parent: parentCategoryId ? parentCategoryId : null, imageUrl },
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
