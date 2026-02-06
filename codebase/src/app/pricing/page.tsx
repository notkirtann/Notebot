import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import UpgradeButton from '@/components/UpgradeButton'
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PLANS } from '@/config/stripe'
import { cn } from '@/lib/utils'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { ArrowRight, Check, HelpCircle, Minus } from 'lucide-react'
import Link from 'next/link'

const Page = () => {
  const { getUser } = getKindeServerSession()
  const user = getUser()

  const pricingItems = [
    {
      plan: 'Free',
      tagline: 'Perfect for getting started.',
      quota: 10,
      features: [
        {
          text: '5 pages per PDF',
          footnote: 'Maximum number of pages per uploaded PDF.',
        },
        {
          text: '4MB file size limit',
          footnote: 'Maximum size per PDF upload.',
        },
        { text: 'Mobile-friendly interface' },
        {
          text: 'Higher-quality AI responses',
          footnote: 'Advanced response quality and accuracy.',
          negative: true,
        },
        {
          text: 'Priority support',
          negative: true,
        },
      ],
    },
    {
      plan: 'Pro',
      tagline: 'For power users and professionals.',
      quota: PLANS.find((p) => p.slug === 'pro')!.quota,
      features: [
        {
          text: '25 pages per PDF',
          footnote: 'Maximum number of pages per uploaded PDF.',
        },
        {
          text: '16MB file size limit',
          footnote: 'Maximum size per PDF upload.',
        },
        { text: 'Mobile-friendly interface' },
        {
          text: 'Higher-quality AI responses',
          footnote: 'Smarter, more detailed answers from your documents.',
        },
        { text: 'Priority support' },
      ],
    },
  ]

  return (
    <MaxWidthWrapper className='mb-16 mt-24 max-w-5xl text-center'>
      {/* Header */}
      <div className='mx-auto mb-12 max-w-lg'>
        <h1 className='text-6xl font-extrabold tracking-tight sm:text-7xl'>
          Simple pricing
        </h1>
        <p className='mt-6 text-gray-600 sm:text-lg'>
          Choose the plan that fits your workflow with Notebot.
        </p>
      </div>

      {/* Pricing cards */}
      <div className='grid grid-cols-1 gap-10 pt-12 lg:grid-cols-2'>
        <TooltipProvider>
          {pricingItems.map(({ plan, tagline, quota, features }) => {
            const price =
              PLANS.find(
                (p) => p.slug === plan.toLowerCase()
              )?.price.amount || 0

            const isPro = plan === 'Pro'

            return (
              <div
                key={plan}
                className={cn(
                  'relative rounded-2xl bg-white p-1 shadow-lg',
                  isPro
                    ? 'bg-gradient-to-br from-blue-600 to-violet-600'
                    : 'border border-gray-200'
                )}>
                <div className='rounded-2xl bg-white'>
                  {isPro && (
                    <div className='absolute -top-4 left-0 right-0 mx-auto w-36 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-1.5 text-sm font-semibold text-white'>
                      Most popular
                    </div>
                  )}

                  <div className='p-6'>
                    <h3 className='text-3xl font-bold'>{plan}</h3>
                    <p className='mt-2 text-gray-500'>{tagline}</p>

                    <div className='my-6 flex items-end justify-center gap-1'>
                      <span className='text-6xl font-extrabold'>
                        ${price}
                      </span>
                      <span className='mb-2 text-gray-500'>
                        /month
                      </span>
                    </div>
                  </div>

                  <div className='flex h-16 items-center justify-center border-y border-gray-200 bg-gray-50'>
                    <div className='flex items-center gap-1 text-sm text-gray-700'>
                      {quota.toLocaleString()} PDFs / month
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className='ml-1 cursor-default'>
                          <HelpCircle className='h-4 w-4 text-gray-500' />
                        </TooltipTrigger>
                        <TooltipContent className='w-64 p-2'>
                          Number of PDF uploads allowed per month.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <ul className='space-y-5 px-8 py-10 text-left'>
                    {features.map(
                      ({ text, footnote, negative }) => (
                        <li
                          key={text}
                          className='flex gap-4'>
                          {negative ? (
                            <Minus className='h-6 w-6 text-gray-300' />
                          ) : (
                            <Check className='h-6 w-6 text-blue-600' />
                          )}

                          <div className='flex items-center gap-1'>
                            <span
                              className={cn(
                                'text-gray-600',
                                negative && 'text-gray-400'
                              )}>
                              {text}
                            </span>
                            {footnote && (
                              <Tooltip delayDuration={300}>
                                <TooltipTrigger className='cursor-default'>
                                  <HelpCircle className='h-4 w-4 text-gray-500' />
                                </TooltipTrigger>
                                <TooltipContent className='w-72 p-2'>
                                  {footnote}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </li>
                      )
                    )}
                  </ul>

                  <div className='border-t border-gray-200 p-6'>
                    {plan === 'Free' ? (
                      <Link
                        href={user ? '/dashboard' : '/sign-in'}
                        className={buttonVariants({
                          className: 'w-full',
                          variant: 'secondary',
                        })}>
                        {user ? 'Go to dashboard' : 'Get started'}
                        <ArrowRight className='ml-1.5 h-5 w-5' />
                      </Link>
                    ) : user ? (
                      <UpgradeButton />
                    ) : (
                      <Link
                        href='/sign-in'
                        className={buttonVariants({
                          className: 'w-full',
                        })}>
                        Upgrade to Pro
                        <ArrowRight className='ml-1.5 h-5 w-5' />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </TooltipProvider>
      </div>
    </MaxWidthWrapper>
  )
}

export default Page
