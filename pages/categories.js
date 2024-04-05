import { useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Categories() {
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState('');
  const [editedCategory, setEditedCategory] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (session) {
      fetchCategories();
    }
  }, [session]);

  function fetchCategories() {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = { name, parentCategory, imageUrl };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
      toast.success('Category updated!!');
    } else {
      await axios.post('/api/categories', data);
      toast.success('Category created successfully');
    }
    setName('');
    setImageUrl(''); // Reset the imageUrl state after saving
    setParentCategory('');
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }

  async function deleteCategory(category) {
    const { _id } = category;
    await axios.delete('/api/categories?_id=' + _id);
    closeModal();
    fetchCategories();
    toast.success('Category deleted!!');
  }

  async function uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('/api/upload', formData);
      const uploadedImageUrl = response.data.url;
      setImageUrl(uploadedImageUrl); // Update the state with the uploaded image URL
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
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
                  {/* Input field for uploading image */}
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(ev) => {
                      const file = ev.target.files[0];
                      if (file) {
                        uploadImage(file);
                      }
                    }}
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
                {categories.map((category, index) => (
                  <tr
                    key={category._id}
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2 font-medium text-gray-700'>
                      {index + 1}
                    </td>
                    <td className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2 text-gray-700'>
                      {category.name}
                    </td>
                    <td className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2 text-gray-700'>
                      {category?.parent?.name}
                    </td>
                    <td className='whitespace-nowrap px-2 py-2 sm:px-4 sm:py-2'>
                      <div className='flex flex-col sm:flex-row gap-2'>
                        <Link
                          onClick={() => editCategory(category)}
                          href={'/categories'}
                          className='inline-block rounded bg-green-600 px-2 py-1 text-xs sm:text-sm sm:px-4 sm:py-2 font-medium text-white hover:bg-green-700 text-center'
                        >
                          Edit
                        </Link>
                        <div
                          onKeyDown={() => setShowModal(false)}
                          className='inline-block rounded bg-red-600 text-xs sm:text-sm font-medium text-white hover:bg-red-700 text-center'
                        >
                          <button
                            onClick={toggleModal}
                            className='px-2 py-1 sm:px-4 sm:py-2'
                          >
                            Delete
                          </button>
                          {showModal && (
                            <>
                              <div className='fixed inset-0 z-10 bg-gray-300/50'></div>
                              <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0'>
                                <div className='mx-auto w-full overflow-hidden rounded-lg bg-white shadow-xl sm:max-w-sm'>
                                  <div className='relative p-5'>
                                    <div className='text-center'>
                                      <div className='mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500'>
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          fill='none'
                                          viewBox='0 0 24 24'
                                          strokeWidth='1.5'
                                          stroke='currentColor'
                                          className='h-6 w-6'
                                        >
                                          <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                                          />
                                        </svg>
                                      </div>
                                      <div>
                                        <h3 className='text-lg font-medium text-gray-700'>
                                          Delete blog post
                                        </h3>
                                        <div className='mt-2 text-sm text-gray-500 max-w-sm'>
                                          Are you sure you want to delete this{' '}
                                          {category?.name}?
                                        </div>
                                      </div>
                                    </div>
                                    <div className='mt-5 flex justify-end gap-3'>
                                      <button
                                        onClick={closeModal}
                                        className='flex-1 rounded-lg border border-gray-300 bg-white px-2 py-1 sm:px-4 sm:py-2 text-center text-xs sm:text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400'
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        className='flex-1 rounded-lg border border-red-500 bg-red-500 px-2 py-1 sm:px-4 sm:py-2 text-center text-xs sm:text-sm font-medium text-white shadow-sm transition-all hover:border-red-700 hover:bg-red-700 focus:ring focus:ring-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-300'
                                        onClick={() => deleteCategory(category)}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
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
