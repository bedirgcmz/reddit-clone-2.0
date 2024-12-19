// 'use client'
// import { notFound } from 'next/navigation'
// import Link from 'next/link'

// import { getPost } from '@/lib/queries'
// import { auth } from '@/lib/auth'
// import { DeletePostButton } from '@/components/delete-post-button'
// import { FaCircle, FaRegComment, FaShare } from 'react-icons/fa'
// import formatDate from '@/utils/set-date'
// import { AiFillEdit } from 'react-icons/ai'
// import { Votes } from '@/components/Votes/votes'
// import Comments from '@/components/Comments/comments'
// import { useState } from 'react'
// import CommentModal from '@/components/Comments/comment-modal'

// export const revalidate = 900 // 15 min

// export default async function PostPage({
//   params,
// }: {
//   params: Promise<{ id: string }>
// }) {
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   const id = (await params).id
//   const post = await getPost(id)

//   if (!post) {
//     return notFound()
//   }

//   const user = await auth.getUser()
//   const isAuthor = user && user.id === post.author.id

//   return (
//     <main className='main w-full rounded-lg p-3 shadow-sm'>
//       <article className='space-y-4'>
//         <header className='flex items-start justify-between'>
//           <div className='space-y-1'>
//             <span className='flex items-center justify-start text-[14px] text-zinc-600'>
//               r/{post.author.username}{' '}
//               <FaCircle className='mx-2 text-[6px] text-gray-300' />
//               <span className='text-gray-400'>
//                 {formatDate(post.createdAt)}
//               </span>
//               <span className='ms-2 text-[12px] text-gray-400'>
//                 {post.updatedAt &&
//                   post.updatedAt !== post.createdAt &&
//                   `
//               (Edited ${formatDate(post.updatedAt)})`}
//               </span>
//             </span>
//             <h1 className='text-2xl font-bold'>{post.title}</h1>
//           </div>
//           {isAuthor && (
//             <div className='flex gap-3'>
//               <Link href={`/post/${post.id}/edit`} className='button-secondary'>
//                 <AiFillEdit className='me-1' /> edit
//               </Link>
//               <DeletePostButton postId={post.id} />
//             </div>
//           )}
//         </header>
//         <p>{post.content}</p>
//       </article>
//       <div className='mt-3 flex w-full items-center justify-start gap-2'>
//         <Votes
//           postId={id}
//           userId={post.author.id}
//           score={post.score}
//           upvotes={post.upvotes}
//           downvotes={post.downvotes}
//         />
//         <button
//           className='rounded-full bg-gray-100 px-3 py-2'
//           onClick={() => setIsModalOpen(!isModalOpen)}
//         >
//           <FaRegComment />
//         </button>
//         <span className='rounded-full bg-gray-100 px-3 py-2'>
//           <FaShare />
//         </span>
//       </div>
//       <CommentModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//       <div>
//         <Comments postId={id} />
//       </div>
//     </main>
//   )
// }

import { notFound } from 'next/navigation'
import { getPost } from '@/lib/queries'
import { auth } from '@/lib/auth'
import PostContent from '@/components/post-content' // Büyük harfli

export default async function PostPage({ params }: { params: { id: string } }) {
  const id = params.id
  const post = await getPost(id)

  if (!post) {
    return notFound()
  }

  const user = await auth.getUser()
  const isAuthor = user ? user.id === post.author.id : false

  return (
    <main className='w-full p-3'>
      <PostContent post={post} isAuthor={isAuthor} />
    </main>
  )
}
