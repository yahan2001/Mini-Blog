import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { assets, blogCategories } from '../../assets/assets'

const AddBlog = () => {

  const [image, setImage] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [subtitle, setSubtitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [isPublic, setIsPublic] = React.useState(false)

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'link'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ]
  }

  const onSubmit = (e) => {
    e.preventDefault()
    // Placeholder submit until API integration is added.
    console.log({ image, title, subtitle, description, category, isPublic })
  }

  return (
    <form onSubmit={onSubmit} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-y-auto '>
      <div className='bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded'>
        <p>Upload thumbnail</p>
        <label htmlFor="img">
          <img src={ !image ? assets.upload_area : URL.createObjectURL(image)} alt="" className='mt-2 h-16 rounded cursor-pointer' />
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="img" hidden required /> 
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

        <p className='mt-4'>Sub title</p>
        <input
          type='text'
          className='mt-2 w-full p-2 border border-gray-300 rounded outline-none'
          placeholder='Type here'
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          required
        />

        <p className='mt-4'>Blog Description</p>
        <div className='mt-2 relative'>
          <ReactQuill
            theme='snow'
            value={description}
            onChange={setDescription}
            modules={quillModules}
            className='bg-white'
          />
          <button
            type='button'
            className='absolute right-3 bottom-3 text-xs px-3 py-1.5 rounded bg-gray-800 text-white cursor-not-allowed opacity-80'
          >
            Generate with AI
          </button>
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

        <button type='submit' className='mt-6 px-6 py-2 bg-primary text-white rounded cursor-pointer'>
          Add Blog
        </button>

      </div>

    </form>
  )
}

export default AddBlog