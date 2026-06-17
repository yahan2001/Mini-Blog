import React, { useEffect, useState } from 'react'
import {assets} from '../assets/assets'
import { useAppContext } from '../context/useAppContext';
import { stripHtml } from '../utils/blog'
const Header = () => {

  const { blogs, token, navigate, input, setInput } = useAppContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchTerm = input.trim().toLowerCase()
  const todayBlogs = blogs.filter((blog) => {
    const createdAt = new Date(blog.createdAt)
    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - createdAt.getTime()
    return diff <= 24 * 60 * 60 * 1000
  }).length

  const searchPages = [
    { label: 'Home feed', path: '/' },
    { label: 'Write a post', path: token ? '/admin/addBlog' : '/admin' },
    { label: 'My Blogs', path: '/my-blogs' },
  ]

  const searchResults = searchTerm
    ? blogs.filter((blog) => [
      blog.title,
      blog.subTitle,
      blog.category,
      stripHtml(blog.description || ''),
      blog.metaDescription,
    ].some((value) => value?.toLowerCase().includes(searchTerm))).slice(0, 5)
    : []

  useEffect(() => {
    const openSearch = () => setIsSearchOpen(true)
    window.addEventListener('open-search-modal', openSearch)
    return () => window.removeEventListener('open-search-modal', openSearch)
  }, [])

  useEffect(() => {
    const closeSearch = (e) => {
      if (e.key === 'Escape') setIsSearchOpen(false)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener('keydown', closeSearch)
    return () => window.removeEventListener('keydown', closeSearch)
  }, [])

  const handlePageClick = (path) => {
    setIsSearchOpen(false)
    navigate(path)
  }

  const submitSearch = (e) => {
    e.preventDefault()
    setIsSearchOpen(false)
    navigate('/')
  }

  const openBlog = (blog) => {
    setIsSearchOpen(false)
    navigate(`/blog/${blog.slug || blog._id}`)
  }
  
  return (
    <div className='mx-4 sm:mx-8 lg:mx-10 mt-4 relative'>
        <div className='bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm'>
          <div className='flex items-center justify-between border-b border-gray-100 px-5 py-4 text-sm text-gray-500'>
            <p className='font-semibold text-gray-800'>Popular posts</p>
            <p>Last 24h: <span className='text-primary font-medium'>{todayBlogs}</span> articles</p>
          </div>

          <div className='relative px-6 sm:px-12 py-12 sm:py-16 bg-white'>
            <div className='max-w-4xl'>
              <div className='inline-flex items-center justify-center gap-3 px-4 py-1.5 mb-5 border border-primary/30 bg-white rounded-full text-sm text-primary'>
                  <p>New: AI feature integrated</p>
                  <img src={assets.star_icon} className='w-2.5' alt="" />
              </div>

              <h1 className='text-4xl sm:text-6xl font-semibold text-gray-800 leading-tight'>Write to think.<br/><span className='text-gray-400'>Publish to connect.</span></h1>
              <p className='my-6 max-w-2xl text-gray-500 leading-7'>AI can help generate ideas, but your thinking makes the blog worth reading. Share what you learn, keep drafts organized, and build your own writing space.</p>
              <p className='mb-7 font-medium text-gray-700'>Your blog is your reputation - start building it.</p>

              <div className='flex flex-col sm:flex-row gap-3'>
                <button onClick={() => navigate(token ? '/admin/addBlog' : '/admin')} className='bg-primary text-white px-7 py-3 rounded cursor-pointer hover:bg-primary/90'>
                  Start writing
                </button>
              </div>
            </div>

          </div>
        </div>
        <img src={assets.gradientBackground} alt="" className='absolute -top-40 right-0 -z-1 opacity-40' />

        {isSearchOpen && (
          <div className='fixed inset-0 z-50 bg-black/40 px-4 py-10'>
            <div className='mx-auto max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden'>
              <form onSubmit={submitSearch} className='flex items-center gap-3 border-b border-gray-200 px-5 py-4'>
                <span className='text-gray-400 text-xl'>⌕</span>
                <input
                  id='home-search'
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Search MiniBlog...'
                  className='flex-1 outline-none text-gray-700 placeholder:text-gray-400'
                />
                <button onClick={() => setIsSearchOpen(false)} className='text-2xl leading-none text-gray-500 hover:text-gray-800 cursor-pointer'>
                  ×
                </button>
              </form>

              <div className='p-5'>
                <div className='flex items-center gap-3 text-sm text-gray-400'>
                  <button onClick={() => setInput('')} className='px-3 py-1 rounded bg-gray-100 cursor-pointer'># tags</button>
                  <button onClick={() => setInput('')} className='px-3 py-1 rounded bg-gray-100 cursor-pointer'>@ users</button>
                </div>

                {searchTerm && (
                  <div className='mt-5'>
                    <p className='mb-2 text-sm font-medium text-gray-500'>Posts</p>
                    <div className='space-y-1'>
                      {searchResults.length > 0 ? searchResults.map((blog) => (
                        <button
                          key={blog._id}
                          onClick={() => openBlog(blog)}
                          className='w-full flex items-center gap-3 rounded px-3 py-3 text-left text-gray-700 hover:bg-gray-50 cursor-pointer'
                        >
                          <img src={blog.image} alt='' className='h-12 w-16 rounded border border-gray-100 object-cover bg-gray-100 shrink-0' />
                          <span className='min-w-0 flex-1'>
                            <span className='block truncate font-medium text-gray-800'>{blog.title}</span>
                            <span className='mt-1 block truncate text-sm text-gray-400'>{blog.subTitle || stripHtml(blog.description || '').slice(0, 80)}</span>
                          </span>
                        </button>
                      )) : (
                        <div className='rounded px-3 py-8 text-center text-sm text-gray-400'>No matching posts.</div>
                      )}
                    </div>
                  </div>
                )}

                <p className='mt-5 mb-2 text-sm font-medium text-gray-500'>Pages</p>
                <div className='space-y-1'>
                  {searchPages.map((page) => (
                    <button
                      key={page.label}
                      onClick={() => handlePageClick(page.path)}
                      className='w-full flex items-center gap-3 px-3 py-3 rounded text-left text-gray-700 hover:bg-gray-50 cursor-pointer'
                    >
                      <span className='w-2 h-2 rounded-full bg-primary/60'></span>
                      {page.label}
                    </button>
                  ))}
                </div>

                <div className='mt-5 pt-4 border-t border-gray-200'>
                  <p className='mb-2 text-sm font-medium text-gray-500'>Search</p>
                  <button
                    onClick={() => handlePageClick('/')}
                    className='w-full flex items-center justify-between px-3 py-3 rounded text-left text-gray-700 hover:bg-gray-50 cursor-pointer'
                  >
                    <span>{input ? `Find "${input}" in posts` : 'Type to search posts'}</span>
                    <span className='text-xs text-gray-400'>Enter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}   

export default Header
