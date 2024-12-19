'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { DeletePostButton } from '@/components/delete-post-button'
import { FaCircle, FaRegComment, FaShare } from 'react-icons/fa'
import formatDate from '@/utils/set-date'
import { AiFillEdit } from 'react-icons/ai'
import { Votes } from '@/components/Votes/votes'
import Comments from '@/components/Comments/comments'
import CommentModal from '@/components/Comments/comment-modal'
import { PostPageData } from '@/lib/schemas'

type PostContentProps = {
  post: PostPageData
  isAuthor: boolean
}

const PostContent: React.FC<PostContentProps> = ({ post, isAuthor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className='main w-full rounded-lg p-3 shadow-sm'>
      <article className='space-y-4'>
        <header className='flex items-start justify-between'>
          <div className='space-y-1'>
            <span className='flex items-center justify-start text-[14px] text-zinc-600'>
              r/{post.author.username}{' '}
              <FaCircle className='mx-2 text-[6px] text-gray-300' />
              <span className='text-gray-400'>
                {formatDate(post.createdAt)}
              </span>
              <span className='ms-2 text-[12px] text-gray-400'>
                {post.updatedAt &&
                  post.updatedAt !== post.createdAt &&
                  `(Edited ${formatDate(post.updatedAt)})`}
              </span>
            </span>
            <h1 className='text-2xl font-bold'>{post.title}</h1>
          </div>
          {isAuthor && (
            <div className='flex gap-3'>
              <Link href={`/post/${post.id}/edit`} className='button-secondary'>
                <AiFillEdit className='me-1' /> edit
              </Link>
              <DeletePostButton postId={post.id} />
            </div>
          )}
        </header>
        <p>{post.content}</p>
      </article>
      <div className='mt-3 flex w-full items-center justify-start gap-2'>
        <Votes
          postId={post.id}
          userId={post.author.id}
          score={post.score}
          upvotes={post.upvotes}
          downvotes={post.downvotes}
        />
        <button
          className='rounded-full bg-gray-100 px-3 py-2'
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <FaRegComment />
        </button>
        <span className='rounded-full bg-gray-100 px-3 py-2'>
          <FaShare />
        </span>
      </div>
      <CommentModal
        isOpen={isModalOpen}
        postId={post.id}
        onClose={() => setIsModalOpen(false)}
      />
      <div>
        <Comments postId={post.id} />
      </div>
    </main>
  )
}

export default PostContent
