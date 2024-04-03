import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/products').then((response) => {
      setProducts(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }, []);

  const totalImagesCount = products.reduce(
    (total, product) => total + product.images.length,
    0
  );
  const totalPrice = products.reduce(
    (total, product) => total + product.price,
    0
  );

  if (session) {
    return (
      <>
        <main
          className={` min-h-screen p-4 md:custom-margin lg:custom-margin xl:custom-margin 2xl:custom-margin`}
        >
          <header>
            <div className='mx-auto  px-4 py-8 sm:px-6 sm:py-12 lg:px-8'>
              <div className='sm:flex sm:items-center sm:justify-between  '>
                <div className='text-center sm:text-center'>
                  <h1 className='text-3xl font-bold text-gray-700 sm:text-3xl '>
                    Welcome Back,{' '}
                    <span className='text-green-700 font-bold flex flex-col'>
                      {session.user.fullName || ''}
                    </span>
                  </h1>

                  <p className='mt-1.5 text-md text-gray-500 max-w-md'>
                    Manage and add products.
                  </p>
                </div>

                <div className='mt-4 md:ml-11 lg:ml-11 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center'>
                  <Link
                    href={'/products'}
                    className='inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-500 px-5 py-3 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring'
                    type='button'
                  >
                    <span className='text-sm font-medium'> View Products </span>

                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                      />
                    </svg>
                  </Link>
                  <Link
                    href={'/'}
                    target='_blank'
                    className='inline-flex items-center justify-center gap-1.5 rounded-lg border border-purple-500 px-5 py-3 text-purple-500 transition hover:bg-purple-50 hover:text-purple-700 focus:outline-none focus:ring'
                    type='button'
                  >
                    <span className='text-sm font-medium'> View Shop </span>

                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'
                      className='w-4 h-4'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 lg:gap-8'>
            <div className='h-32 rounded-lg bg-gray-200 flex items-center justify-center'>
              <article className='flex max-md:flex-col items-end justify-between rounded-lg gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Products</p>

                  <p className='text-2xl font-medium text-gray-700'>
                    {products.length}
                  </p>
                </div>
                <div className='inline-flex gap-2 rounded bg-purple-100 p-1 text-purple-600'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z'
                    />
                  </svg>

                  <span className='text-xs font-medium'>
                    {' '}
                    {products.length}{' '}
                  </span>
                </div>
              </article>
            </div>
            <div className='h-32 rounded-lg bg-gray-200 flex items-center justify-center'>
              <article className='flex max-md:flex-col items-end justify-between rounded-lg gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Images</p>

                  <p className='text-2xl font-medium text-gray-700'>
                    {totalImagesCount}
                  </p>
                </div>
                <div className='inline-flex gap-2 rounded bg-purple-100 p-1 text-purple-600'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
                    />
                  </svg>

                  <span className='text-xs font-medium'>
                    {' '}
                    {totalImagesCount}{' '}
                  </span>
                </div>
              </article>
            </div>
            <div className='h-32 rounded-lg bg-gray-200 flex items-center justify-center'>
              <article className='flex max-md:flex-col items-end justify-between rounded-lg gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Categories</p>

                  <p className='text-2xl font-medium text-gray-700'>
                    {categories.length}
                  </p>
                </div>
                <div className='inline-flex gap-2 rounded bg-purple-100 p-1 text-purple-600'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122'
                    />
                  </svg>

                  <span className='text-xs font-medium'>
                    {' '}
                    {categories.length}{' '}
                  </span>
                </div>
              </article>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main
        className={`flex min-h-screen flex-col items-center justify-center p-5 text-center `}
      >
        <div className='max-w-xl lg:max-w-3xl'>
          <div className='max-w-xl lg:max-w-3xl flex flex-col items-center'>
            <Image
              src='https://res.cloudinary.com/dcknlnne1/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1709827936/favicon-32x32_rllh9h.jpg?_s=public-apps'
              alt='Logo'
              width={36}
              height={36}
            />
          </div>
          <h1 className='mt-6 text-2xl font-bold text-gray-700 sm:text-3xl md:text-4xl'>
            Welcome to LB CMS
          </h1>
          <p className='mt-4 leading-relaxed text-gray-500 max-w-sm'>
            This website is only accessible to admins only. Add new products and
            manage database.
          </p>
          <div className='col-span-6 sm:flex sm:items-center sm:gap-4 my-4 flex items-center justify-center mt-10'>
            <button
              disabled={isLoading}
              onClick={() => {
                setIsLoading(true);
                signIn('google');
              }}
              className='inline-block shrink-0 rounded-md border border-purple-800 bg-purple-800 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-purple-800 focus:outline-none focus:ring active:text-blue-500'
            >
              Login
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
