import React from 'react'
import toast from 'react-hot-toast'
import PublicSidebar from '../components/PublicSidebar'
import { Blogcard } from '../components/Blogcard'
import { useAppContext } from '../context/useAppContext'

const Drafts = () => {
  const { axios, token, navigate } = useAppContext()
  const [drafts, setDrafts] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    const fetchDrafts = async () => {
      if (!token) return

      try {
        setIsLoading(true)
        const { data } = await axios.get('/api/blog/my')
        if (data.success) {
          setDrafts(data.blogs.filter((blog) => !blog.isPublished))
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrafts()
  }, [axios, token])

  return (
    <div className='min-h-screen bg-gray-50 lg:flex'>
      <PublicSidebar />
      <main className='flex-1 p-4 sm:p-8 lg:p-10'>
        <div className='min-h-[calc(100vh-5rem)] bg-white border border-gray-200 rounded-lg shadow-sm'>
          <div className='flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4'>
            <h1 className='font-semibold text-gray-800'>Drafts</h1>
            <button onClick={() => navigate(token ? '/admin/addBlog' : '/admin')} className='bg-primary text-white px-5 py-2.5 rounded cursor-pointer hover:bg-primary/90'>
              + New Draft
            </button>
          </div>
          {isLoading ? (
            <div className='px-5 py-16 text-center text-gray-500'>Loading drafts...</div>
          ) : drafts.length > 0 ? (
            <div className='px-5'>
              {drafts.map((blog) => <Blogcard key={blog._id} blog={blog} />)}
            </div>
          ) : (
            <div className='flex min-h-[60vh] items-center justify-center px-5 text-center'>
              <div>
                <div className='mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-5xl text-gray-400'>▣</div>
                <h2 className='text-2xl font-semibold text-gray-900'>No drafts yet</h2>
                <p className='mt-3 text-gray-500'>Start a post and keep it unpublished to see it here.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Drafts
