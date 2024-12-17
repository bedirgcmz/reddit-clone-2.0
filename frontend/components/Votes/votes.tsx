import { cn } from '@/utils/classnames'
import { LuArrowBigDown, LuArrowBigUp } from 'react-icons/lu'

export const Votes = ({
  userId,
  score,
  upvotes,
  downvotes,
}: {
  postId: string
  userId: string | null
  score: number | null
  upvotes: string[]
  downvotes: string[]
}) => {
  return (
    <div className='flex items-center gap-1 rounded-full bg-gray-100'>
      <button
        className={cn(
          'button-tertiary',
          userId && upvotes.includes(userId) && 'text-primary',
        )}
      >
        <LuArrowBigUp />
      </button>
      <span>{score}</span>
      <button
        className={cn(
          'button-tertiary',
          userId && downvotes.includes(userId) && 'text-primary',
        )}
      >
        <LuArrowBigDown />
      </button>
    </div>
  )
}
