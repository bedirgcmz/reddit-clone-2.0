'use client'

import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createComment } from '@/actions/comments/create-comment'

interface CommentModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
  // onSubmit: (content: string) => void
}
// Comment Modal Component
const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  postId,
  // onSubmit,
}) => {
  const [comment, setComment] = useState('')

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Swal.fire({
        title: 'Error!',
        text: 'Please write something to add a comment',
        icon: 'error',
        confirmButtonText: 'Okay',
      })
      return
    }

    try {
      // createComment fonksiyonuna uygun veri göndermek
      const result = await createComment(postId, { content: comment })
      console.log('Comment created:', result)
    } catch (error) {
      console.error('Error creating comment:', error)
    }
    // onSubmit(comment)
    // createComment(postId, comment)
    console.log(postId)
    console.log(comment)

    setComment('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='w-full max-w-lg rounded-lg bg-white p-6'>
      <textarea
        className='mb-1 h-full min-h-[100px] w-full rounded-lg border p-2 pb-6'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Write your comment here...'
      />
      <div className='flex justify-end gap-2'>
        <button
          onClick={onClose}
          className='rounded bg-gray-200 px-2 py-1 text-sm text-gray-600 hover:bg-red-300 hover:text-white'
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className='rounded bg-gray-200 px-2 py-1 text-sm text-gray-600 hover:bg-blue-600 hover:text-white'
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default CommentModal
