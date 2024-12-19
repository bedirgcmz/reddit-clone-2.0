import { notFound } from 'next/navigation'
import { getPost } from '@/lib/queries'
import { auth } from '@/lib/auth'
import PostContent from '@/components/post-content'
import GoBackButton from '@/components/go-back-button'

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    return notFound()
  }

  const user = await auth.getUser()
  const isAuthor = user ? user.id === post.author.id : false

  return (
    <main className='mt-2 flex w-full justify-center p-3'>
      <GoBackButton />
      <PostContent post={post} isAuthor={isAuthor} userId={user?.id} />
    </main>
  )
}
