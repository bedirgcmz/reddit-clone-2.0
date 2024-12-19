'use client'
import React, { useEffect, useState } from 'react'
import { getComments } from '../../lib/queries'
import { FaCircle } from 'react-icons/fa'
import formatDate from '@/utils/set-date'

interface Comment {
  _id: string
  content: string
  author: {
    username: string
  }
  createdAt: string
  updatedAt: string
}

interface CommentsProps {
  postId: string
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const data = await getComments(postId)
        console.log(data) // null geliyor

        if (data) {
          //   setComments((prev) => [...prev, ...data])
          setComments(data)
        }
      } catch (err) {
        setError('Could not load comments.')
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [postId])

  if (loading) return <p>Loading comments...</p>
  if (error) return <p>{error}</p>

  return (
    <div className='mt-3 p-2 ps-4'>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className='mb-3'>
            <p className='flex items-center justify-start'>
              @{comment.author.username}
              <FaCircle className='mx-2 text-[6px] text-gray-300' />
              <span className='text-[12px] text-gray-400'>
                {formatDate(comment.createdAt)}
              </span>
              <span className='ms-2 text-[12px] text-gray-400'>
                {comment.updatedAt &&
                  comment.updatedAt !== comment.createdAt &&
                  `(Edited ${formatDate(comment.updatedAt)})`}
              </span>
            </p>
            <p>{comment.content}</p>
          </div>
        ))
      ) : (
        <p>No comments available.</p>
      )}
    </div>
  )
}

export default Comments
