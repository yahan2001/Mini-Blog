import React from 'react'
import CommentTitleItem from './CommentTitleItem'

import { useAppContext } from '../../context/useAppContext'
import toast from 'react-hot-toast'
const Comment = () => {

  const [comments, setComments] = React.useState([])
  const [filter , setFilter] = React.useState('Not Approved')  

  const{axios} = useAppContext() // su dung hook useAppContext de lay gia tri axios tu context de thuc hien cac yeu cau HTTP den server

  //tao ham fetchComments de lay danh sach cac comment tu server va cap nhat state comments, neu co loi thi hien thi thong bao loi
  const fetchComments = React.useCallback(async () => {
    try {
      const { data } = await axios.get('/api/admin/comments');
      data.success ? setComments(data.comments) : toast.error(data.message);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error(error.message);
    }
  }, [axios])

  React.useEffect(() => {
    fetchComments()
  }, [fetchComments])


  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-pink-50/50'>
      <div className='flex justify-between items-center max-w-3xl'>
        <h1>Comments</h1>
        <div className='flex gap-4'>
          <button onClick={()=> setFilter ('Approved')} className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${filter === 'Approved' ? 'text-primary' : 'text-gray-700'}`}>Approved</button>
          <button onClick={()=> setFilter ('Not Approved')} className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs ${filter === 'Not Approved' ? 'text-primary' : 'text-gray-700'}`}>Not Approved</button>

        </div>

      </div>
      <div className='relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-white rounded-lg shadow-rounded-lg scrollbar-hide'>
        <table className='w-full text-sm text-gray-500 '>
          <thead className='text-xs text-gray-700 text-left uppercase'>
            <tr>
              <th scope='col' className='px-6 py-3'> Blog Title & Comment </th>
              <th scope='col' className='px-6 py-3 max-sm:hidden'> Date </th>
              <th scope='col' className='px-6 py-3 '> Action </th>
            </tr>
          </thead>
          <tbody>
            {comments.filter((comment) =>{
              if(filter === 'Approved') return comment.isApproved === true;
              return comment.isApproved === false;
            }).map((comment,index) => <CommentTitleItem key={comment._id} comment={comment} index={index+1} fetchComments={fetchComments} />)}
              
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default Comment
