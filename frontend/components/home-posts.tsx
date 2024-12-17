'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

import { type HomepagePostsData } from '@/lib/schemas'
import { getPosts } from '@/lib/queries'
import formatDate from '@/utils/set-date'
import { FaCircle } from 'react-icons/fa'
import { Votes } from './Votes/votes'
import { FaRegComment } from 'react-icons/fa'
import { FaShare } from 'react-icons/fa'

export const HomePosts = ({
  initialData,
  limit,
  userId,
}: {
  initialData: HomepagePostsData
  limit: number
  userId: string | null
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['posts'],
      queryFn: async ({ pageParam }) => {
        return await getPosts(limit, pageParam)
      },
      getNextPageParam: (lastPage) => lastPage?.nextPage,
      initialData: {
        pages: [initialData],
        pageParams: [1],
      },
      initialPageParam: 1,
      // refetchOnMount: false, silme isleminden sonra ana menuye donmek icin silindi
    })

  const currentPosts = data.pages.map((page) => page?.posts || []).flat()

  return (
    <section className='flex flex-col items-center gap-4'>
      {currentPosts.map(
        ({
          id,
          title,
          content,
          createdAt,
          updatedAt,
          author,
          score,
          upvotes,
          downvotes,
        }) => (
          <div className='w-full rounded-lg p-3 shadow-sm'>
            <Link
              key={id}
              href={`/post/${id}`}
              className='flex w-full flex-col rounded-3xl bg-white p-4'
            >
              <span className='flex items-center justify-start text-[14px] text-zinc-600'>
                r/{author.username}{' '}
                <FaCircle className='mx-2 text-[6px] text-gray-300' />
                <span className='text-gray-400'>{formatDate(createdAt)}</span>
                <span className='ms-2 text-[12px] text-gray-400'>
                  {updatedAt &&
                    updatedAt !== createdAt &&
                    `
                (Edited ${formatDate(updatedAt)})`}
                </span>
              </span>
              <h2 className='text-lg font-bold'>{title}</h2>
              <p>
                {content && content.length > 250
                  ? `${content.slice(0, 250)}...`
                  : content}
                {content && content.length > 250 && (
                  <Link
                    href={`/post/${id}`}
                    className='text-blue-500 underline'
                  >
                    Read more
                  </Link>
                )}
              </p>
            </Link>
            <div className='mt-3 flex w-full items-center justify-start gap-2'>
              <Votes
                postId={id}
                userId={userId}
                score={score}
                upvotes={upvotes}
                downvotes={downvotes}
              />
              <span className='rounded-full bg-gray-100 px-3 py-2'>
                <FaRegComment />
              </span>
              <span className='rounded-full bg-gray-100 px-3 py-2'>
                <FaShare />
              </span>
            </div>
          </div>
        ),
      )}
      <Loader
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </section>
  )
}

const Loader = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}) => {
  const loader = useRef(null)

  useEffect(() => {
    const { current: svg } = loader
    if (!svg) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !isFetchingNextPage) {
        fetchNextPage()
      }
    })

    observer.observe(svg)
    return () => {
      observer.unobserve(svg)
    }
  }, [loader, fetchNextPage, isFetchingNextPage])

  if (!hasNextPage) {
    return null
  }

  return (
    <svg
      ref={loader}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='animate-spin'
    >
      <path d='M21 12a9 9 0 1 1-6.219-8.56' />
    </svg>
  )
}
