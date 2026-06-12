import React from 'react'

const CommentTableItem({comment,fetchComment}) => {
    const {blog,createAt, _id}= comment;
    const BlogDate = new Date(createAt);

    const {axios} = useAppContext() // su dung hook useAppContext de lay gia tri axios tu context de thuc hien cac yeu cau HTTP den server
    const approveComment = async () => {
        try {
            const {data} = await axios.put('/api/admin/comments', { id: _id, isApproved: true }); // thuc hien yeu cau PUT den server de cap nhat trang thai duyet cua comment theo id
            if (data.success) {
                toast.success(data.message); // neu yeu cau thanh cong thi hien thi thong bao duyet comment thanh cong
                await fetchComment(); // goi ham fetchComment de cap nhat lai danh sach cac comment sau khi duyet
            } else {
                toast.error(data.message); // neu yeu cau khong thanh cong thi hien thi thong bao loi
            } 
        } catch (error) {
            console.error("Error approving comment:", error);
            toast.error(error.message); // neu co loi thi hien thi thong bao loi
        }
    }
    
     const deleteComment = async () => {
        try {
            const confirm = window.confirm("Are you sure you want to delete this comment?"); // hien thi hop thoai xac nhan truoc khi xoa comment
            if (!confirm) return;
            const { data } = await axios.delete('/api/admin/comments', { data: { id: _id } }); // thuc hien yeu cau DELETE den server de xoa comment theo id
            if (data.success) {
                toast.success(data.message); // neu yeu cau thanh cong thi hien thi thong bao xoa comment thanh cong
                await fetchComment(); // goi ham fetchComment de cap nhat lai danh sach cac comment sau khi xoa
            } else {
                toast.error(data.message); // neu yeu cau khong thanh cong thi hien thi thong bao loi
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error(error.message); // neu co loi thi hien thi thong bao loi
        }
    return (
        <tr className='border-y border-gray-300'>
            <td className ='px-6 py-4'>
                <b className='font-medium text-gray-600'> Blog </b> : {blog.title} <br />
                    <br />
                    <br />
                <b className='font-medium text-gray-600'> Comment </b> : {comment.content}
                <br />
                <b className='font-medium text-gray-600'> Created At </b> : {BlogDate.toLocaleString()}
            </td>
            <td className='px-6 py-4 max-sm:hidden'>{BlogDate.toDateString()}</td>
            <td className='px-6 py-4 flex gap-3'>
                <div className='inline-flex items-center gap-4' >
                    {
                        !comment.isApproved ?
                        <img onClick={approveComment} src={assets.tick_icon} className='w-5 hover:scale-110 transition-all cursor-pointer' />
                        : <p className='text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1'>Approved</p>
                    }
                    <img onClick={deleteComment} src={assets.bin_icon} alt="" className ='w-5 hover:scale-110 transition-all cursor-pointer' />
                </div>
            </td>
        </tr>
    )
}

export default CommentTableItem
           
