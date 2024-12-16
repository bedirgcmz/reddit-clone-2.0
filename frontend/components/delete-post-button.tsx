'use client'

import { useMutation } from '@tanstack/react-query'

import { deletePost } from '@/actions/delete-post'
import { handleServerActionError, toastServerError } from '@/lib/error-handling'
import { MdDeleteForever } from 'react-icons/md'

export const DeletePostButton = ({ postId }: { postId: string }) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      handleServerActionError(await deletePost(postId))
    },
    onError: toastServerError,
  })

  return (
    <button onClick={() => mutate()} className='button-secondary'>
      <MdDeleteForever className='me-1' />{' '}
      {isPending ? 'deleting post...' : 'delete'}
    </button>
  )
}
