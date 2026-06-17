import React from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/useAppContext'
import toast from 'react-hot-toast'

const BlogTableItem = ({ blog ,fetchBlogs,index}) => {
    
  const { title, createdAt } = blog;
  const BlogDate = new Date(createdAt)

  const {axios, navigate} = useAppContext() // su dung hook useAppContext de lay gia tri axios tu context de thuc hien cac yeu cau HTTP den server

  const deleteBlog = async () => {
    const confirm = window.confirm("Are you sure you want to delete this blog?");
    if (!confirm) return;
    try{
      const { data } = await axios.delete('/api/admin/blogs', { data: { id: blog._id } } ); // thuc hien yeu cau DELETE den server de xoa blog theo id
      if (data.success) {
        toast.success(data.message); // neu yeu cau thanh cong thi hien thi thong bao xoa blog thanh cong
       await fetchBlogs(); // goi ham fetchBlogs de cap nhat lai danh sach cac blog sau khi xoa
      }else {
        toast.error(data.message); // neu yeu cau khong thanh cong thi hien thi thong bao loi
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(error.message); // neu co loi thi hien thi thong bao loi
    }
  }

  const togglePublish = async () => {
    try {
      const {data} = await axios.put('/api/admin/blogs', { id: blog._id, isPublished: !blog.isPublished }); // thuc hien yeu cau PUT den server de cap nhat trang thai publish cua blog theo id
      if (data.success) {
        toast.success(data.message); // neu yeu cau thanh cong thi hien thi thong bao cap nhat trang thai publish thanh cong
        await fetchBlogs(); // goi ham fetchBlogs de cap nhat lai danh sach cac blog sau khi cap nhat
      } else {
        toast.error(data.message); // neu yeu cau khong thanh cong thi hien thi thong bao loi
      } 
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error(error.message); // neu co loi thi hien thi thong bao loi
    }
  }

  return (
    <tr className='border-y border-gray '>
        <th className='px-2 py-4'>{index}</th>
        <td className='px-2 py-4'>{title}</td>
        <td className='px-2 py-4 max-sm:hidden'>{BlogDate.toDateString()}</td>
        <td className='px-2 py-4 max-sm:hidden'>
            <p className={blog.isPublished ? 'text-green-600' : 'text-orange-700'}
            >{blog.isPublished ? 'Published' : 'Unpublished'}</p>
        </td>
        <td className='px-2 py-4 flex text-xs gap-3'>
            <button onClick={() => navigate(`/admin/editBlog/${blog._id}`)} className='border px-2 py-0.5 mt-1 rounded cursor-pointer'>Edit</button>
            <button onClick={togglePublish} className='border px-2 py-0.5 mt-1 rounded cursor-pointer '>{blog.isPublished ? 'Unpublish' : 'Publish'}</button>
            <img src={assets.cross_icon} className='w-8 hover:scale-110 transition-all cursor-pointer' alt=""  onClick={deleteBlog}/>
        </td>
    </tr>
  )
}

export default BlogTableItem
