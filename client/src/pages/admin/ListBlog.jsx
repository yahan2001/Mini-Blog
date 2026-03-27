import React from 'react'
import BlogTableItem from '../../components/admin/BlogTableItem'
import { assets, blog_data } from '../../assets/assets'

const Listblog = () => {

  const [blogs, setBlogs] = React.useState([])

  const fetchBlogs = async () => {
    setBlogs(blog_data)
  }

  React.useEffect(() => {
    fetchBlogs()
  } , [])


  return (
    <div className='flex-1 pt-5 px-5 sm:pt-10 sm:pl-16 bg-pink-50/50'>
      <h1>All Blogs</h1>

      <div className='flex items-center gap-3 m-4 mt-6 text-gray-600'>
          <img src={assets.dashboard_icon_4} alt="" />
          <p>Latest Blogs</p>
        </div>
        <div className='relative h-4/5 max-w-4xl overflow-x-auto shadow rounded-lg srollbar-hide bg-white'>
          <table className='w-full text-sm text-gray-500'>
            <thead className='text-xs text-gray-600 text left uppercase '>
              <tr>
                <th scope='col' className='px-2 py-4 xl:px-6'>#</th>
                <th scope='col' className='px-2 py-4'>Blog Title</th>
                <th scope='col' className='px-2 py-4 max-sm:hidden'>Date</th>
                <th scope='col' className='px-2 py-4 max-sm:hidden'>Status</th>
                <th scope='col' className='px-2 py-4'>Actions</th>
              </tr>

            </thead>
            <tbody>
             {blogs.map((blog, index) => {
  return (
    <BlogTableItem
      key={blog._id}
      blog={blog}
      fetchBlogs={fetchBlogs}
      index={index + 1}
    />
  )
})}

            </tbody>
          </table>
        </div>

    </div>
  )
}

export default Listblog