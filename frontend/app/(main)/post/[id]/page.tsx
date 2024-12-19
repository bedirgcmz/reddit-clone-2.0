// import { notFound } from 'next/navigation'
// import { getPost } from '@/lib/queries'
// import { auth } from '@/lib/auth'
// import PostContent from '@/components/post-content' // Büyük harfli

// export default async function PostPage({ params }: { params: { id: string } }) {
//   const {id} = await params.id
//   const post = await getPost(id)

//   if (!post) {
//     return notFound()
//   }

//   const user = await auth.getUser()
//   const isAuthor = user ? user.id === post.author.id : false

//   return (
//     <main className='flex w-full justify-center p-3'>
//       <PostContent post={post} isAuthor={isAuthor} userId={user?.id} />
//     </main>
//   )
// }

import { notFound } from 'next/navigation'
import { getPost } from '@/lib/queries'
import { auth } from '@/lib/auth'
import PostContent from '@/components/post-content' // Büyük harfli

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await params // `await` kullanarak erişim sağlanıyor
  const post = await getPost(id)

  if (!post) {
    return notFound()
  }

  const user = await auth.getUser()
  const isAuthor = user ? user.id === post.author.id : false

  return (
    <main className='flex w-full justify-center p-3'>
      <PostContent post={post} isAuthor={isAuthor} userId={user?.id} />
    </main>
  )
}
