import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { assets } from "../assets/assets"
import moment from 'moment'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/useAppContext'
import { Blogcard } from '../components/Blogcard'
import { getReadingTime } from '../utils/blog'
import PublicSidebar from '../components/PublicSidebar'

const Blog = () => {
  const { id } = useParams()
  const { blogs, token, user, navigate, axios } = useAppContext()

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState('')
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const fetchComments = useCallback(async (blogId) => {
    try {
      const { data } = await axios.get(`/api/blog/comment/${blogId}`)
      if (data.success) {
        setComments(data.comments)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [axios])

  const fetchBlogData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/blog/${id}`)
      const blogData = response.data.blog || response.data.data
      if (response.data.success && blogData) {
        setData(blogData)
        setLikes(blogData.likedBy?.length || 0)
        setIsLiked(blogData.likedBy?.some((userId) => userId === user?.id || userId === user?._id) || false)
        fetchComments(blogData._id)
      } else {
        toast.error('Blog not found')
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [axios, fetchComments, id, user?.id, user?._id])

  const likeBlog = async () => {
    if (!data?._id) return
    if (!token) {
      navigate('/admin')
      return
    }

    try {
      const response = await axios.post('/api/blog/like', { blogId: data._id })
      if (response.data.success) {
        setLikes(response.data.likes)
        setIsLiked(response.data.liked)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }
  
  const addcomment = async (e) => {
    e.preventDefault()
    if (!data?._id) {
      toast.error('Blog not loaded yet')
      return
    }

    try {
      const response = await axios.post('/api/blog/add-comment', { content, blogId: data._id })
      if (response.data.success) {
        toast.success('Comment added successfully')
        setContent('')
        fetchComments(data._id)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchBlogData()
  }, [fetchBlogData])

  useEffect(() => {
    if (!data) return

    document.title = `${data.title} | MiniBlog`

    let metaTag = document.querySelector('meta[name="description"]')
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.setAttribute('name', 'description')
      document.head.appendChild(metaTag)
    }

    metaTag.setAttribute('content', data.metaDescription || data.subTitle || '')
  }, [data])

  if (loading) return <Loader />
  if (!data) return <div>Blog not found</div>

  const relatedPosts = blogs
    .filter((blog) => blog._id !== data._id && blog.category === data.category)
    .slice(0, 3)

  return (
    <div className='min-h-screen bg-gray-50 lg:flex'>
      <PublicSidebar />
      <main className='relative flex-1 bg-white'>
        <img
          src={assets.gradientBackground}
          alt=""
          className='absolute -top-50 -z-1 opacity-50'
        />

      <div className='text-center pt-20 text-gray-600'>
        <p className='text-primary py-4 font-medium'>
          Published on {moment(data.createdAt).format('MMMM Do YYYY')}
        </p>

        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>
          {data.title}
        </h1>

        <h2 className='my-5 max-w-lg truncate mx-auto'>
          {data.subTitle}
        </h2>

        <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary'>
          Michael Brown
        </p>
        <p className='text-sm text-gray-400'>{getReadingTime(data.description)} min read</p>
        <button onClick={likeBlog} className={`mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium hover:bg-gray-50 cursor-pointer ${isLiked ? 'text-primary' : 'text-gray-600'}`}>
          <FiHeart className={isLiked ? 'fill-current' : ''} />
          {likes} likes
        </button>
      </div>

      <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
        <img src={data.image} alt="" className='rounded-3xl mb-5' />

        <div
          className='rich-text max-w-3xl mx-auto'
          dangerouslySetInnerHTML={{ __html: data.description }}
        />

        {/* COMMENTS */}
        <div className='mt-14 mb-10 max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>
            Comments ({comments.length})
          </p>

          {comments.length > 0 ? (
            comments.map((item, index) => (
              <div
                key={index}
                className='relative bg-primary/5 border border-primary/5 max-w-xl p-4 rounded text-gray-600 mb-4'
              >
                <div className='flex items-center gap-2 mb-2'>
                  <img src={assets.user_icon} alt="" className='w-6' />
                  <p className='font-medium'>{item.name}</p>
                </div>

                <p className='text-sm max-w-md ml-8'>
                  {item.content}
                </p>

                <div className='text-xs ml-8 mt-2'>
                  {moment(item.createdAt).format('MMMM Do YYYY')}
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-500'>No comments yet.</p>
          )}
        </div>

        {/* ADD COMMENT */}
        <div className='max-w-3xl mx-auto border border-gray-300 p-6 rounded-lg shadow-md mt-10'>
          <p className='font-semibold mb-4'>Add your comment</p>

          <form onSubmit={addcomment} className='flex flex-col items-start gap-4 max-w-lg w-full'>
            {token ? (
              <>
                <p className='text-sm text-gray-500'>Commenting as <span className='font-medium text-gray-700'>{user?.name}</span></p>
                <textarea onChange={(e) => setContent(e.target.value)} value={content} placeholder='Comment' required className='w-full p-2 border border-gray-300 rounded outline-none h-48'></textarea>

                <button type='submit' className='bg-primary text-white p-2 px-8 hover:scale-105 transition-all cursor-pointer rounded'>
                  Submit
                </button>
              </>
            ) : (
              <div>
                <p className='text-gray-500 mb-4'>Please sign in as an author to comment.</p>
                <button type='button' onClick={() => navigate('/admin')} className='bg-primary text-white p-2 px-8 hover:scale-105 transition-all cursor-pointer rounded'>
                  Sign in
                </button>
              </div>
            )}
          </form>
        </div>

        {/*share buttons*/}
        <div className='my-24 max-w-3xl mx-auto'>
          <p className='font-semibold my-4'>Share this article on social media</p>
          <div className='flex'>
            <img src={assets.facebook_icon} width={50} alt="Facebook" />
            <img src={assets.twitter_icon} width={50} alt="Twitter" />
            <img src={assets.googleplus_icon} width={50} alt="Google+" />
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className='my-24 max-w-5xl mx-auto'>
            <h3 className='text-2xl font-semibold text-gray-800 mb-8'>Related posts</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
              {relatedPosts.map((blog) => (
                <Blogcard key={blog._id} blog={blog} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
      </main>
    </div>
  )
}

export default Blog
