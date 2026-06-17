import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import ReactQuill from 'react-quill'
import { useParams } from 'react-router-dom'
import 'react-quill/dist/quill.snow.css'
import { assets, blogCategories } from '../../assets/assets'
import { useAppContext } from '../../context/useAppContext'
import { parse } from 'marked' // su dung marked de chuyen doi markdown sang html
import { stripHtml } from '../../utils/blog'
const AddBlog = () => {

  const { token, navigate } = useAppContext()
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoadingBlog, setIsLoadingBlog] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const [image, setImage] = React.useState(false)
  const [existingImage, setExistingImage] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [subtitle, setSubtitle] = React.useState('')
  const [metaDescription, setMetaDescription] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [isPublic, setIsPublic] = React.useState(false)

  React.useEffect(() => {
    const fetchBlog = async () => {
      if (!isEditMode) return

      try {
        setIsLoadingBlog(true)
        const { data } = await axios.get(`/api/admin/blogs/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (data.success) {
          const blog = data.blog
          setTitle(blog.title || '')
          setSubtitle(blog.subTitle || '')
          setMetaDescription(blog.metaDescription || '')
          setDescription(blog.description || '')
          setCategory(blog.category || '')
          setExistingImage(blog.image || '')
          setIsPublic(Boolean(blog.isPublished))
        } else {
          toast.error(data.message)
          navigate('/admin/listBlogs')
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message)
      } finally {
        setIsLoadingBlog(false)
      }
    }

    fetchBlog()
  }, [id, isEditMode, navigate, token])

  const callAi = async (prompt) => {
    const { data } = await axios.post('/api/blog/generate-content', { prompt }, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 60000
    })

    if (!data.success) {
      throw new Error(data.message)
    }

    return data.content
  }

  const cleanAiText = (value) => {
    return stripHtml(parse(value))
      .replace(/^["']|["']$/g, '')
      .trim()
  }

  const generateContent = async () => {
    if (!title) {
      toast.error('Please enter a title first')
      return
    }

    try {
      setIsAdding(true)
      const content = await callAi(`Write a helpful blog post in Vietnamese about: ${title}`)
      setDescription(parse(content))
      toast.success('Content generated successfully')
    } catch (error) {
      console.error('Error:', error)
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again later.')
      } else if (error.response?.status === 429) {
        toast.error('API quota exceeded. Please try again in a few moments.')
      } else {
        toast.error(error.response?.data?.message || error.message)
      }
    } finally {
      setIsAdding(false)
    }
  }

  const generateSubtitle = async () => {
    if (!title) {
      toast.error('Please enter a title first')
      return
    }

    try {
      setIsAdding(true)
      const content = await callAi(`Write one concise blog subtitle in Vietnamese for this title. Return only the subtitle, no markdown: ${title}`)
      setSubtitle(cleanAiText(content))
      toast.success('Subtitle generated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsAdding(false)
    }
  }

  const generateMetaDescription = async () => {
    if (!title && !description) {
      toast.error('Please enter a title or description first')
      return
    }

    try {
      setIsAdding(true)
      const content = await callAi(`Write one SEO meta description in Vietnamese under 155 characters. Return only plain text. Title: ${title}. Content: ${stripHtml(description).slice(0, 800)}`)
      setMetaDescription(cleanAiText(content).slice(0, 155))
      toast.success('Meta description generated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsAdding(false)
    }
  }
      
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'link'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ]
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    
    if ((!image && !isEditMode) || !title || !subtitle || !description || !category) {
      toast.error('Please fill all fields')
      return
    }

    try {
      setIsAdding(true)
      const formData = new FormData()
      if (image) formData.append('image', image)
      formData.append('title', title)
      formData.append('subTitle', subtitle)
      formData.append('metaDescription', metaDescription)
      formData.append('description', description)
      formData.append('category', category)
      formData.append('isPublished', isPublic)

      const response = isEditMode
        ? await axios.put(`/api/admin/blogs/${id}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        : await axios.post('/api/blog', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        toast.success(isEditMode ? 'Blog updated successfully' : 'Blog added successfully')
        navigate('/admin/listBlogs')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsAdding(false)
    }
  }

  const thumbnailPreview = image ? URL.createObjectURL(image) : existingImage || assets.upload_area

  if (isLoadingBlog) {
    return (
      <div className='flex-1 bg-blue-50/50 text-gray-600 h-full p-10'>
        Loading blog...
      </div>
    )
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-y-auto '>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
        <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h1 className='text-2xl font-semibold text-gray-800'>{isEditMode ? 'Edit Blog' : 'Add Blog'}</h1>
            <p className='text-sm text-gray-400'>{isEditMode ? 'Update content, thumbnail, category, and publish status.' : 'Create a new blog post for your site.'}</p>
          </div>
          <button
            type='button'
            onClick={() => navigate('/admin/listBlogs')}
            className='border border-gray-300 px-4 py-2 rounded text-sm cursor-pointer hover:bg-gray-50'
          >
            Back to list
          </button>
        </div>

        <p>Upload thumbnail</p>
        <label htmlFor="img">
          <img src={thumbnailPreview} alt="" className='mt-2 h-20 w-32 object-cover rounded cursor-pointer border border-gray-200' />
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="img" hidden required={!isEditMode} /> 
        </label>

        <p className='mt-4'>Blog title</p>
        <input
          type='text'
          className='mt-2 w-full p-2 border border-gray-300 rounded outline-none'
          placeholder='Type here'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className='mt-4 flex items-center justify-between gap-3'>
          <p>Sub title</p>
          <button
            disabled={isAdding}
            type='button'
            onClick={generateSubtitle}
            className='text-xs px-3 py-1.5 rounded border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50 disabled:opacity-60'
          >
            Generate subtitle
          </button>
        </div>
        <input
          type='text'
          className='mt-2 w-full p-2 border border-gray-300 rounded outline-none'
          placeholder='Type here'
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          required
        />

        <div className='mt-4 flex items-center justify-between gap-3'>
          <p>SEO meta description</p>
          <button
            disabled={isAdding}
            type='button'
            onClick={generateMetaDescription}
            className='text-xs px-3 py-1.5 rounded border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50 disabled:opacity-60'
          >
            Generate SEO
          </button>
        </div>
        <textarea
          className='mt-2 w-full p-2 border border-gray-300 rounded outline-none h-24 resize-none'
          placeholder='Short summary for search engines'
          value={metaDescription}
          maxLength={155}
          onChange={(e) => setMetaDescription(e.target.value)}
        />
        <p className='mt-1 text-xs text-gray-400'>{metaDescription.length}/155 characters</p>

        <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
          <p>Blog Description</p>
          <div className='flex flex-wrap gap-2'>
            <button
              disabled={isAdding}
              type='button'
              onClick={() => setIsPreviewOpen(true)}
              className='text-sm px-4 py-2 rounded border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50'
            >
              Preview
            </button>
            <button
              disabled={isAdding}
              type='button'
              onClick={generateContent}
              className={`text-sm px-4 py-2 rounded text-white transition-all ${
                isAdding
                  ? 'bg-gray-400 cursor-not-allowed opacity-60'
                  : 'bg-gray-800 hover:bg-gray-900 cursor-pointer opacity-100'
              }`}
            >
              {isAdding ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
        </div>
        <div className='mt-2'>
          <ReactQuill
            theme='snow'
            value={description}
            onChange={setDescription}
            modules={quillModules}
            className='bg-white min-h-80 [&_.ql-container]:min-h-64 [&_.ql-editor]:min-h-64 [&_.ql-editor]:text-base [&_.ql-editor]:leading-7'
          />
        </div>

        <div className='mt-4 flex flex-wrap items-center gap-4'>
          <div>
            <p>Blog category</p>
            <select
              className='mt-2 p-2 border border-gray-300 rounded outline-none'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value='' disabled>Select category</option>
              {blogCategories.filter((item) => item !== 'All').map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className='flex items-center gap-2 pt-6'>
            <label htmlFor='isPublic'>Publish Now</label>
            <input
              id='isPublic'
              type='checkbox'
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          </div>
        </div>

        <button disabled={isAdding} type='submit' className='mt-6 px-6 py-2 bg-primary text-white rounded cursor-pointer'>
          {isAdding ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Blog' : 'Add Blog')}
        </button>

      </div>

      {isPreviewOpen && (
        <div className='fixed inset-0 z-50 bg-black/50 px-4 py-6 overflow-y-auto'>
          <div className='mx-auto max-w-3xl bg-white rounded shadow-lg'>
            <div className='flex items-center justify-between border-b border-gray-200 px-5 py-4'>
              <p className='font-semibold text-gray-800'>Blog Preview</p>
              <button type='button' onClick={() => setIsPreviewOpen(false)} className='text-gray-500 hover:text-gray-900 cursor-pointer'>
                Close
              </button>
            </div>
            <div className='p-5'>
              <img src={thumbnailPreview} alt='' className='w-full aspect-video object-cover rounded bg-gray-100' />
              <p className='mt-5 text-sm text-primary font-medium'>{category || 'Category'}</p>
              <h2 className='mt-2 text-3xl font-semibold text-gray-900'>{title || 'Blog title'}</h2>
              <p className='mt-2 text-gray-500'>{subtitle || 'Sub title'}</p>
              {metaDescription && <p className='mt-4 text-sm text-gray-400'>{metaDescription}</p>}
              <div className='rich-text mt-6' dangerouslySetInnerHTML={{ __html: description || '<p>Blog description preview...</p>' }} />
            </div>
          </div>
        </div>
      )}

    </form>
  )
}

export default AddBlog
