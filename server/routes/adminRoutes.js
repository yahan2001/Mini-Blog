import express from 'express';
// Import cả 2 hàm từ file controller
import { adminLogin, addBlog } from '../controllers/adminController.js'; 
import { getAllBlogs } from '../controllers/blogController.js';
import upload from '../middleware/multer.js';

const blogRouter = express.Router();

// Route xử lý login
blogRouter.post("/login", adminLogin);

// Route xử lý thêm blog với middleware multer
blogRouter.post("/add", upload.single('image'), addBlog);

// Compatibility route: một số request đang gọi /api/admin/all
blogRouter.get('/all', getAllBlogs);
blogRouter.post('/all', getAllBlogs);

export default blogRouter;