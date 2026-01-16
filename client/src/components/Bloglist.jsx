import React from 'react'
import { blogCategories } from '../assets/assets'
import { assets } from '../assets/assets'

const Bloglist = () => {
  return (
    <div>
        <div className='flex justify-center gap-4 sm:gap-8 my-10 relative'>
            {blogCategories.map((item)=>(
                <div key = {item} className='relative'>
                    <button>
                        {item}
                        <div className='absolute'></div>
                    </button>
                </div>
            ))}
        </div>
        <div>
            {/* Blog cards go here */}
        </div>
    </div>
  )
}

export default Bloglist