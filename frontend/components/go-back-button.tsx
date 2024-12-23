'use client'

import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

const GoBackButton = () => {
  const router = useRouter()
  const handleBackClick = () => {
    router.back() // Sayfayı önceki sayfaya yönlendir
  }

  return (
    <button
      onClick={handleBackClick}
      className='absolute left-[1rem] top-[5rem] flex items-center rounded-lg bg-gray-800 px-2 py-1 text-sm text-white hover:bg-gray-700 sm:left-[9rem] sm:top-[5rem]'
    >
      <FaArrowLeft className='mr-2' /> Back
    </button>
  )
}

export default GoBackButton
