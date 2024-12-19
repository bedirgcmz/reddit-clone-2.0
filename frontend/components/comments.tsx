'use client'
import React, { useEffect, useState } from 'react'
import { getComments } from '../lib/queries'

interface Comment {
  _id: string
  content: string
  author: {
    username: string
  }
}

interface CommentsProps {
  postId: string
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  //   useEffect(() => {
  //     const fetchComments = async () => {
  //       try {
  //         setLoading(true)
  //         const data = await getComments(postId)
  //         console.log(data)

  //         if (data) {
  //           setComments((prev) => [...prev, data])
  //         }
  //       } catch (err) {
  //         setError('Could not load comments.')
  //       } finally {
  //         setLoading(false)
  //       }
  //     }

  //     fetchComments()
  //   }, [postId])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const data = await getComments(postId)
        console.log(data) // null geliyor

        if (data) {
          setComments((prev) => [...prev, ...data])
        }
      } catch (err) {
        setError('Could not load comments.')
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [postId])

  console.log(comments) // bos geliyor
  console.log(postId) // dogru id geliyor

  if (loading) return <p>Loading comments...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h3>Comments</h3>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className='mb-2 border-b pb-2'>
            <p className='font-bold'>{comment.author.username}</p>
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
