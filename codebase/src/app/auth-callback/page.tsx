'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { trpc } from '../_trpc/client'
import { Loader2 } from 'lucide-react'

const Page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const origin = searchParams.get('origin')

  trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        router.push(origin ? `/${origin}` : '/dashboard')
      }
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        router.push('/sign-in')
      }
    },
    retry: true,
    retryDelay: 500,
  })

  return (
    <div className='flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-muted/40'>
      <div className='flex flex-col items-center gap-3 rounded-2xl bg-background px-8 py-10 shadow-sm'>
        <Loader2 className='h-9 w-9 animate-spin text-primary' />

        <h3 className='text-xl font-semibold'>
          Setting up your Notebot account
        </h3>

        <p className='max-w-xs text-center text-sm text-muted-foreground'>
          We’re preparing your workspace. You’ll be redirected
          automatically in just a moment.
        </p>
      </div>
    </div>
  )
}

export default Page
