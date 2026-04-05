import express from "express";
import auth from "../middleware/auth.js";
import { deleteBlogsById, getAllBlogs, getBlogsById, togglePublishBlog, updateBlogById } from "../controllers/blogController.js";

const router = express.Router();

router.get('/all', getAllBlogs);
router.get('/:id', getBlogsById);
router.post('/toggle-publish', auth, togglePublishBlog);
router.post('/delete', auth, deleteBlogsById);
router.post('/update', auth, updateBlogById);

export default router;