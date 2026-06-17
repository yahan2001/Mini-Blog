import React from 'react'
import { useNavigate } from 'react-router-dom';
import { getReadingTime, stripHtml } from '../utils/blog';
import moment from 'moment';

export const Blogcard = ({blog}) => {
    const {title, description, category, image, _id, slug, createdAt} = blog;
    const navigate = useNavigate();
  return (
    <div onClick={()=> navigate(`/blog/${slug || _id}`)} className='group flex flex-col sm:flex-row gap-4 py-5 border-b border-gray-200 cursor-pointer'>
        <img src={image} alt="" className='w-full sm:w-44 aspect-video object-cover rounded border border-gray-100 bg-gray-100' />
        <div className='flex-1 min-w-0'>
            <div className='flex flex-wrap items-center gap-2 text-sm text-gray-400'>
              <span className='font-medium text-gray-600'>MiniBlog Author</span>
              <span>·</span>
              <span>{createdAt ? moment(createdAt).fromNow() : 'Just now'}</span>
              <span>·</span>
              <span>{getReadingTime(description)} min read</span>
            </div>
            <h5 className='mt-2 text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2'>{title}</h5>
            <p className='mt-2 text-sm text-gray-500 line-clamp-2'>{stripHtml(description).slice(0, 150)}</p>
            <div className='mt-4 flex items-center gap-3'>
              <span className='px-3 py-1 inline-block bg-primary/10 rounded-full text-primary text-xs'>{category}</span>
              <span className='text-xs text-gray-400'>Read article</span>
            </div>
        </div>
    </div>
  )
}
