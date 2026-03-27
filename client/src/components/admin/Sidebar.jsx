import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Sidebar = () => {
  return (
    <div>

      <NavLink
        end
        to='/admin'
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:min-w-64 cursor-pointer ${
            isActive ? 'bg-primary/10 border-r-4 border-primary' : ''
          }`
        }
      >
        <img src={assets.home_icon} alt="" className='w-5' />
        <p className='hidden md:inline-block'>Dashboard</p>
      </NavLink>

      <NavLink
        to = '/admin/addBlog'
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:min-w-64 cursor-pointer ${
            isActive ? 'bg-primary/10 border-r-4 border-primary' : ''
          }`
        }
      >
        <img src={assets.add_icon} alt="" className='w-5' />
        <p className='hidden md:inline-block'>Add Blogs</p>
      </NavLink>

      <NavLink
        to = '/admin/listBlogs'
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:min-w-64 cursor-pointer ${
            isActive ? 'bg-primary/10 border-r-4 border-primary' : ''
          }`
        }
      >
        <img src={assets.list_icon} alt="" className='w-5' />
        <p className='hidden md:inline-block'>Blog List</p>
      </NavLink>

      <NavLink
        to = '/admin/comments'
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:min-w-64 cursor-pointer ${
            isActive ? 'bg-primary/10 border-r-4 border-primary' : ''
          }`
        }
      >
        <img src={assets.comment_icon} alt="" className='w-5' />
        <p className='hidden md:inline-block'>Comments</p>
      </NavLink>

    </div>
  )
}

export default Sidebar