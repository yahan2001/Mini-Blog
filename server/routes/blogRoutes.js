import express from "express";
import auth from "../middleware/auth.js";
import {
	addComment,
	createBlog,
	deleteBlogsById,
	getAllBlogs,
	getBlogComments,
	getBlogsById,
	togglePublishBlog,
	updateBlogById
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post('/', upload.single('image'), auth, createBlog); // tao blog moi
router.get('/all', getAllBlogs); // lay tat ca cac blog da publish tu database gui ve client
router.get('/:id', getBlogsById);// lay mot blog theo id tu database gui ve client
router.post('/toggle-publish', auth, togglePublishBlog);
router.post('/delete', auth, deleteBlogsById);
router.post('/update', auth, updateBlogById);

router.post('/add-comment', addComment); // them route de them comment cho blog
router.get('/comment/:blogId', getBlogComments); // them route de lay tat ca comment cua mot blog theo id tu database gui ve client    


export default router;