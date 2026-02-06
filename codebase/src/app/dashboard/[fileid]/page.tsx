import ChatWrapper from '@/components/chat/ChatWrapper'
import PdfRenderer from '@/components/PdfRenderer'
import { db } from '@/db'
import { getUserSubscriptionPlan } from '@/lib/stripe'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { notFound, redirect } from 'next/navigation'

interface PageProps {
  params: {
    fileid: string
  }
}

const Page = async ({ params }: PageProps) => {
  const { fileid } = params

  const { getUser } = getKindeServerSession()
  const user = getUser()

  if (!user || !user.id) {
    redirect(`/auth-callback?origin=dashboard/${fileid}`)
  }

  const file = await db.file.findFirst({
    where: {
      id: fileid,
      userId: user.id,
    },
  })

  if (!file) notFound()

  const plan = await getUserSubscriptionPlan()

  return (
    <div className='flex h-[calc(100vh-3.5rem)] flex-col bg-muted/40'>
      <div className='mx-auto flex w-full max-w-[1600px] grow gap-0 lg:px-2'>
        {/* PDF Section */}
        <div className='flex flex-1 flex-col'>
          <div className='h-full overflow-hidden rounded-none bg-background px-4 py-6 sm:px-6 lg:rounded-l-2xl lg:pl-8 xl:pl-6'>
            <PdfRenderer url={file.url} />
          </div>
        </div>

        {/* Chat Section */}
        <aside className='flex w-full flex-col border-t border-border bg-background lg:w-[420px] lg:border-l lg:border-t-0 lg:rounded-r-2xl'>
          <ChatWrapper
            isSubscribed={plan.isSubscribed}
            fileId={file.id}
          />
        </aside>
      </div>
    </div>
  )
}

export default Page
