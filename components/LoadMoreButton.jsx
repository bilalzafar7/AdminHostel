import React from 'react'
import { FaArrowDown } from 'react-icons/fa'

export default function LoadMoreButton() {
  return (
    <div className='flex justify-center my-5'>
        <button className=' bg-gray-800 p-3 rounded-full text-blue-500'>
            <FaArrowDown />
        </button>
    </div>
  )
}
