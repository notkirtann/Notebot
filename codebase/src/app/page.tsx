import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <MaxWidthWrapper className='mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center'>
        <div className='mx-auto mb-6 flex max-w-fit items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-2 shadow-sm backdrop-blur'>
          <p className='text-sm font-semibold text-gray-700'>
            😍 Notebot is now public 😍
          </p>
        </div>

        <h1 className='max-w-4xl text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl'>
          Chat with your{' '}
          <span className='bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent'>
            documents
          </span>{' '}
          in seconds
        </h1>

        <p className='mt-6 max-w-prose text-zinc-600 sm:text-lg'>
          Notebot lets you have intelligent conversations with your PDF files.
          Upload a document and start asking questions instantly.
        </p>

        <Link
          href='/dashboard'
          target='_blank'
          className={buttonVariants({
            size: 'lg',
            className: 'mt-6 gap-2',
          })}>
          Get started for free
          <ArrowRight className='h-5 w-5' />
        </Link>
      </MaxWidthWrapper>

      {/* Preview Section */}
      <div className='relative isolate'>
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
          <div
            className='relative left-1/2 aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-12 bg-gradient-to-tr from-pink-400 to-indigo-400 opacity-30 sm:w-[72rem]'
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 72.5% 32.5%, 60.2% 62.4%, 27.5% 76.7%, 0.1% 64.9%, 27.6% 76.8%, 76.1% 97.7%)',
            }}
          />
        </div>

        <div className='mx-auto max-w-6xl px-6 lg:px-8'>
          <div className='mt-16 rounded-2xl bg-gray-900/5 p-2 ring-1 ring-gray-900/10 sm:mt-24 lg:p-4'>
            <Image
              src='/dashboard-preview.jpg'
              alt='Notebot dashboard preview'
              width={1364}
              height={866}
              quality={100}
              className='rounded-xl bg-white p-2 shadow-2xl sm:p-6 md:p-12'
            />
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className='mx-auto mb-32 mt-32 max-w-5xl sm:mt-56'>
        <div className='mb-12 px-6 lg:px-8 text-center'>
          <h2 className='text-4xl font-bold text-gray-900 sm:text-5xl'>
            Start chatting in minutes
          </h2>
          <p className='mt-4 text-lg text-gray-600'>
            Using Notebot with your PDFs is fast, simple, and powerful.
          </p>
        </div>

        {/* Steps */}
        <ol className='my-8 space-y-6 pt-8 md:flex md:space-x-12 md:space-y-0'>
          {[
            {
              step: 'Step 1',
              title: 'Create your account',
              desc: (
                <>
                  Start with a free plan or upgrade to our{' '}
                  <Link
                    href='/pricing'
                    className='text-blue-600 underline underline-offset-2'>
                    Pro plan
                  </Link>
                  .
                </>
              ),
            },
            {
              step: 'Step 2',
              title: 'Upload your PDF',
              desc: 'Notebot processes your file and prepares it for chat.',
            },
            {
              step: 'Step 3',
              title: 'Ask anything',
              desc: 'Get instant, accurate answers directly from your document.',
            },
          ].map((item) => (
            <li key={item.step} className='md:flex-1'>
              <div className='flex flex-col space-y-2 border-l-4 border-blue-200 py-2 pl-4 md:border-l-0 md:border-t-2 md:pt-4 md:pl-0'>
                <span className='text-sm font-medium text-blue-600'>
                  {item.step}
                </span>
                <span className='text-xl font-semibold'>{item.title}</span>
                <span className='mt-2 text-zinc-700'>{item.desc}</span>
              </div>
            </li>
          ))}
        </ol>

        <div className='mx-auto max-w-6xl px-6 lg:px-8'>
          <div className='mt-16 rounded-2xl bg-gray-900/5 p-2 ring-1 ring-gray-900/10 sm:mt-24 lg:p-4'>
            <Image
              src='/file-upload-preview.jpg'
              alt='Notebot file upload preview'
              width={1419}
              height={732}
              quality={100}
              className='rounded-xl bg-white p-2 shadow-2xl sm:p-6 md:p-12'
            />
          </div>
        </div>
      </div>
    </>
  )
}
