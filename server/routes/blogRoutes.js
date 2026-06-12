import express from "express";
import auth from "../middleware/auth.js";
import { rateLimitMiddleware } from "../utils/rateLimiter.js";
import {
	addComment,
	createBlog,
	deleteBlogsById,
	getAllBlogs,
	getBlogComments,
	getBlogsById,
	togglePublishBlog,
	updateBlogById,
	generateBlogContent
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Routes với xác thực (admin) phải được định nghĩa trước routes với tham số /:id
// Rate limit: 10 requests per minute for generate-content to avoid Gemini API quota issues
router.post('/generate-content', auth, rateLimitMiddleware(3, 60000), generateBlogContent); // them route de tao noi dung blog tu prompt duoc truyen vao tu client
router.post('/', upload.single('image'), auth, createBlog); // tao blog moi
router.post('/toggle-publish', auth, togglePublishBlog);
router.post('/delete', auth, deleteBlogsById);
router.post('/update', auth, updateBlogById);

// Routes công khai
router.get('/all', getAllBlogs); // lay tat ca cac blog da publish tu database gui ve client

router.post('/add-comment', addComment); // them route de them comment cho blog
router.get('/comment/:blogId', getBlogComments); // them route de lay tat ca comment cua mot blog theo id tu database gui ve client
router.get('/:id', getBlogsById);// lay mot blog theo id hoac slug tu database gui ve client


export default router;
