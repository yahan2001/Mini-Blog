import React from 'react'
import toast from 'react-hot-toast'
import { FiHeart, FiMessageCircle } from 'react-icons/fi'
import { useAppContext } from '../context/useAppContext'
import { getReadingTime, stripHtml } from '../utils/blog'
import moment from 'moment'

const HomeFeedItem = ({ blog }) => {
    const { title, description, image, _id, slug, createdAt, likedBy = [], commentsCount = 0 } = blog
    const { navigate, token, user, axios } = useAppContext()
    const [likes, setLikes] = React.useState(likedBy.length)
    const [isLiked, setIsLiked] = React.useState(likedBy.some((id) => id === user?.id || id === user?._id))

    const likeBlog = async (e) => {
        e.stopPropagation()
        if (!token) {
            navigate('/admin')
            return
        }

        try {
            const { data } = await axios.post('/api/blog/like', { blogId: _id })
            if (data.success) {
                setLikes(data.likes)
                setIsLiked(data.liked)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    return (
        <button onClick={() => navigate(`/blog/${slug || _id}`)} className='group w-full flex gap-4 py-5 text-left border-b border-gray-200 cursor-pointer'>
            <img src={image} alt="" className='w-28 sm:w-36 aspect-video object-cover rounded border border-gray-100 bg-gray-100 shrink-0' />
            <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap items-center gap-2 text-sm text-gray-400'>
                    <span className='font-medium text-gray-500'>MiniBlog Author</span>
                    <span>·</span>
                    <span>{createdAt ? moment(createdAt).fromNow() : 'Just now'}</span>
                    <span>·</span>
                    <span>{getReadingTime(description)} min</span>
                </div>
                <h2 className='mt-2 text-lg sm:text-xl font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors'>{title}</h2>
                <p className='mt-1 text-sm text-gray-500 line-clamp-1'>{stripHtml(description).slice(0, 90)}</p>
                <div className='mt-3 flex items-center gap-2 text-gray-500'>
                    <span onClick={likeBlog} className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-gray-200 bg-gray-50 ${isLiked ? 'text-primary' : ''}`}>
                        <FiHeart className={isLiked ? 'fill-current' : ''} /> {likes}
                    </span>
                    <span className='inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-gray-200 bg-gray-50'><FiMessageCircle /> {commentsCount}</span>
                </div>
            </div>
        </button>
    )
}

const Bloglist = () => {
    const { blogs, input, token, navigate } = useAppContext()
    const searchTerm = input.trim().toLowerCase()

    const filterBlogs = () => {
        if (!searchTerm) return blogs

        return blogs.filter((blog) => 
            [
                blog.title,
                blog.subTitle,
                blog.category,
                stripHtml(blog.description || ''),
                blog.metaDescription,
            ].some((value) => value?.toLowerCase().includes(searchTerm))
        )
    }

    const filteredBlogs = filterBlogs()
    const visibleBlogs = searchTerm ? filteredBlogs : filteredBlogs.slice(0, 8)
    const leftBlogs = visibleBlogs.filter((_, index) => index % 2 === 0)
    const rightBlogs = visibleBlogs.filter((_, index) => index % 2 !== 0)


  return (
    <div className='mx-4 sm:mx-8 lg:mx-10 mt-6 mb-10 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 px-5 py-4 text-sm text-gray-500'>
        <p className='font-semibold text-gray-800'>{searchTerm ? `Search results for "${input.trim()}"` : 'Home feed'}</p>
        <p>{filteredBlogs.length} articles</p>
      </div>

      <div className='px-5 py-8'>
        <div className='flex items-center gap-4'>
            <div className='flex items-center gap-3'>
                <span className='w-2.5 h-2.5 rounded-full bg-primary'></span>
                <p className='text-sm font-semibold text-gray-500 uppercase tracking-widest'>{searchTerm ? 'Matching Posts' : 'New & Popular'}</p>
            </div>
            <span className='h-px flex-1 bg-gray-200'></span>
        </div>

        {filteredBlogs.length > 0 ? (
            <div className='mt-6 grid grid-cols-1 xl:grid-cols-2 xl:gap-10'>
                <div>
                    {leftBlogs.map((blog) => <HomeFeedItem key={blog._id} blog={blog} />)}
                </div>
                <div className='xl:border-l xl:border-gray-200 xl:pl-10'>
                    {rightBlogs.map((blog) => <HomeFeedItem key={blog._id} blog={blog} />)}
                </div>
            </div>
        ) : (
            <div className='py-16 text-center text-gray-500'>
                No blogs found.
            </div>
        )}

        <div className='mt-8 border-t border-gray-200 pt-8'>
            <button onClick={() => navigate(token ? '/admin/addBlog' : '/admin')} className='flex w-full items-center gap-4 text-left text-gray-500 cursor-pointer'>
                <span className='flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white font-semibold'>H</span>
                <span className='text-xl font-semibold'>Write</span>
                <span className='ml-auto text-sm font-medium text-primary'>Start writing</span>
            </button>
        </div>
      </div>
    </div>
  )
}

export default Bloglist
