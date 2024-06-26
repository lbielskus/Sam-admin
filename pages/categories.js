import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

export default function Categories({ existingImages }) {
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [images, setImages] = useState(existingImages || []);
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState('');
  const [editedCategory, setEditedCategory] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const uploadImagesQueue = [];
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (session) {
      fetchCategories();
    }
  }, [session]);

  function fetchCategories() {
    axios
      .get('/api/categories')
      .then((result) => {
        setCategories(result.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    if (isUploading) {
      await Promise.all(uploadImagesQueue);
    }
    if (!name) {
      toast.error('Name field is required');
      return;
    }

    // Use parentCategory instead of parentCategoryID
    const data = {
      name,
      parentCategoryId: parentCategory,
      images,
      description,
    };

    if (editedCategory) {
      data._id = editedCategory._id;
      try {
        await axios.put('/api/categories', data);
        setEditedCategory(null);
        toast.success('Category updated!!');
      } catch (error) {
        console.error('Error updating category:', error);
        toast.error('Failed to update category');
      }
    } else {
      try {
        await axios.post('/api/categories', data);
        toast.success('Category created successfully');
        setName('');
        setImages([]);
        setParentCategory('');
        fetchCategories();
      } catch (error) {
        console.error('Error creating category:', error);
        toast.error('Failed to create category');
      }
    }
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }

  async function deleteCategory(category) {
    const { _id } = category;
    try {
      await axios.delete('/api/categories?_id=' + _id);
      fetchCategories();
      toast.success('Category deleted!!');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  }

  async function uploadImage(ev) {
    if (!ev || !ev.target || !ev.target.files) {
      console.error('Invalid event object:', ev);
      return;
    }

    const files = ev.target.files || [];
    if (files.length > 0) {
      setIsUploading(true);
      try {
        for (const file of files) {
          const formData = new FormData();
          formData.append('file', file);
          const response = await axios.post('/api/upload', formData);
          const uploadedImage = response.data.links[0];

          setImages((prevImages) => [...prevImages, uploadedImage]);
        }
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    }
  }

  if (!session) {
    return null;
  }

  if (session) {
    return (
      <>
        <header>
          <div className='mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8'>
            <div className='flex max-sm:flex-col sm:items-center sm:justify-between items-center '>
              <div className='text-center sm:text-left'>
                <h1 className='text-3xl font-bold text-gray-600 sm:text-3xl mr-10 text-center sm:text-center'>
                  All Categories
                </h1>
                <p className='mt-1.5 text-md text-gray-500'>
                  <span>
                    {editedCategory ? (
                      <>
                        Editing category,{' '}
                        <span className='text-green-600 font-bold'>
                          {editedCategory.name}
                        </span>{' '}
                        &nbsp;
                        <span className='text-blue-500 font-bold'>
                          {editedCategory?.parent?.name}
                        </span>
                      </>
                    ) : (
                      'Create a new category!'
                    )}
                  </span>
                </p>
              </div>
              <form
                onSubmit={saveCategory}
                className='mt-4 flex max-sm:flex-col gap-4 sm:mt-3 max-sm:px-4 sm:items-center'
              >
                <div className='max-w-md w-full'>
                  <div className='relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5 text-gray-500'>
                      +
                    </div>
                    <input
                      type='text'
                      id='example11'
                      className='block w-full rounded-md border border-slate-300 py-2.5 pl-8 pr-10 sm:pr-16 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500'
                      placeholder='Category Name'
                      value={name}
                      onChange={(ev) => setName(ev.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <select
                    className='h-full rounded-md border-transparent bg-transparent py-0 pl-3 pr-7 text-gray-500 focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                    value={parentCategory}
                    onChange={(ev) => setParentCategory(ev.target.value)}
                  >
                    <option>No parent</option>
                    {categories.length > 0 &&
                      categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  {!isUploading && (
                    <input
                      type='file'
                      accept='image/*'
                      multiple
                      onChange={uploadImage}
                    />
                  )}
                  {isUploading && <Spinner />}
                </div>
                <div>
                  <textarea
                    value={description}
                    onChange={(ev) => setDescription(ev.target.value)}
                    className='...'
                    placeholder='Category Description'
                  />
                </div>
                <button
                  type='submit'
                  className='rounded-lg border border-blue-100 bg-blue-100 px-5 py-3 text-center text-sm font-medium text-blue-600 transition-all hover:border-blue-200 hover:bg-blue-200 focus:ring focus:ring-blue-50 disabled:border-blue-50 disabled:bg-blue-50 disabled:text-blue-400'
                >
                  {editedCategory ? 'Save changes' : 'Save Category'}
                </button>
              </form>
            </div>
            <hr className='my-8 h-px border-0 bg-gray-300' />
          </div>
        </header>

        <div className={`overflow-x-auto mx-auto p-4`}>
          <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200 bg-white text-md border rounded mb-44'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2 text-gray-700 text-start font-bold'>
                    #
                  </th>
                  <th className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2 text-gray-700 text-start font-bold'>
                    Category
                  </th>
                  <th className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2 text-gray-700 text-start font-bold'>
                    Parent
                  </th>
                  <th className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2 text-gray-700 text-start font-bold'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {categories.map((category, idx) => (
                  <tr key={category._id}>
                    <td className='px-2 py-2 sm:px-4 sm:py-3'>{idx + 1}</td>
                    <td className='px-2 py-2 sm:px-4 sm:py-3'>
                      {category.name}
                    </td>
                    <td className='px-2 py-2 sm:px-4 sm:py-3'>
                      {category.parent ? category.parent.name : 'No parent'}
                    </td>
                    <td className='px-2 py-2 sm:px-4 sm:py-3'>
                      <div className='flex space-x-1'>
                        <button
                          onClick={() => editCategory(category)}
                          className='bg-blue-100 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-200 hover:text-blue-800 focus:outline-none focus:bg-blue-200 focus:text-blue-800'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCategory(category)}
                          className='bg-red-100 text-red-700 px-2 py-1 rounded-md hover:bg-red-200 hover:text-red-800 focus:outline-none focus:bg-red-200 focus:text-red-800'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}
