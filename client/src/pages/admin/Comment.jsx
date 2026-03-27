import React from 'react'

const Comment = () => {

  const [comments, setComments] = React.useState([])
  const [filter , setFilter] = React.useState('Not Approved')  

  const fetchComments = async () => {
    setComments(comments_data)
  }

  React.useEffect(() => {
    fetchComments()
  }, [])


  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-pink-50/50'>
      <div className='flex justify-between items-center max-w-3xl'>
        <h1>Comments</h1>
        <div className='flex gap-4'>
          <button className={'shadow-md bg-green-500 text-white py-2 px-4 rounded'}>Approved</button>
          <button className={'shadow-md bg-red-500 text-white py-2 px-4 rounded'}>Not Approved</button>

        </div>

      </div>
    </div>
  )
}

export default Comment