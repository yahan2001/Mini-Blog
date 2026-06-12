import express from "express";
import {
	adminLogin,
	getAllBlogsAdmin,
	getAllComments,
	deletecommentById,
	approveCommentById,
	getDashboard,
	deleteBlogById,
	updateBlogPublishStatus,
	getBlogByIdAdmin,
	updateBlogByIdAdmin
} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin); // them route de dang nhap cho admin
adminRouter.get('/comments', auth, getAllComments); // them route de lay tat ca comment tu database gui ve client

// them route de lay tat ca blog tu database gui ve client, chi cho phep admin moi co quyen truy cap
adminRouter.get('/blogs', auth, getAllBlogsAdmin); 

adminRouter.get('/blogs/:id', auth, getBlogByIdAdmin);

adminRouter.put('/blogs/:id', auth, upload.single('image'), updateBlogByIdAdmin);

// them route de xoa blog theo id tu database gui ve client, chi cho phep admin moi co quyen truy cap
adminRouter.delete('/blogs', auth, deleteBlogById); 

// them route de cap nhat trang thai publish cua blog, chi cho phep admin moi co quyen truy cap
adminRouter.put('/blogs', auth, updateBlogPublishStatus); 

// them route de xoa comment theo id tu database gui ve client, chi cho phep admin moi co quyen truy cap
adminRouter.post('/delete-comment', auth, deletecommentById); 

// them route de duyet comment theo id tu database gui ve client, chi cho phep admin moi co quyen truy cap
adminRouter.post('/approve-comment', auth, approveCommentById); 

// them route de lay du lieu dashboard tu database gui ve client, chi cho phep admin moi co quyen truy cap
adminRouter.get('/dashboard', auth, getDashboard); 

export default adminRouter;
