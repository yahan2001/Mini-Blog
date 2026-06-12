import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import imagekit from '../configs/imageKit.js'; 
import { createUniqueSlug } from '../utils/slug.js';

// 1. Login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 2. Thêm Blog thật sự

export const addBlog = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected. Please check MongoDB credentials.'
      });
    }

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.json({ success: false, message: "Thiếu file ảnh!" });
    }

    if (!req.body.blog) {
      return res.json({ success: false, message: "Thiếu field blog!" });
    }

    let parsedBlog;
    try {
      parsedBlog = JSON.parse(req.body.blog);
    } catch (e) {
      return res.json({
        success: false,
        message: "Field blog không phải JSON hợp lệ!"
      });
    }

    const { title, subTitle, description, category, metaDescription } = parsedBlog;
    const isPublished = parsedBlog.isPublished ?? true;

    if (!title || !subTitle || !description || !category) {
      return res.json({
        success: false,
        message: "Thiếu title, subTitle, description hoặc category!"
      });
    }

    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "blogs"
    });

    const newBlog = new Blog({
      title,
      subTitle,
      slug: await createUniqueSlug(title),
      metaDescription,
      description,
      category,
      image: uploadResponse.url,
      isPublished
    });

    await newBlog.save();

    return res.json({
      success: true,
      message: "Blog đã được tạo và lưu thành công!",
      data: newBlog
    });
  } catch (error) {
    console.error("FULL ERROR:", error);
    return res.json({
      success: false,
      message: error.message
    });
  }
};

export const getAllBlogsAdmin = async (req, res) => {
    try {
      
        const blogs = await Blog.find().sort({ createdAt: -1 });// lay tat ca cac blog tu database va sap xep theo thoi gian tao moi nhat o tren
        res.json({ success: true, blogs });// gui ve client du lieu cac blog
    } catch (error) {
        res.json({ success: false, message: error.message });   
    }
}

export const getBlogByIdAdmin = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        res.json({ success: true, blog });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const updateBlogByIdAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subTitle, description, category, isPublished, metaDescription } = req.body;

        const updateData = {};
        if (title !== undefined) {
            updateData.title = title;
            updateData.slug = await createUniqueSlug(title, id);
        }
        if (subTitle !== undefined) updateData.subTitle = subTitle;
        if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (isPublished !== undefined) {
            updateData.isPublished = isPublished === 'true' || isPublished === true;
        }

        if (req.file) {
            const uploadResponse = await imagekit.upload({
                file: req.file.buffer,
                fileName: req.file.originalname,
                folder: "blogs"
            });

            updateData.image = uploadResponse.url;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedBlog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        res.json({ success: true, message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const getAllComments = async (req, res) => {
    try {

      // lay tat ca comment tu database va sap xep theo thoi gian tao moi nhat o tren,
      // lay thong tin cua blog ma comment do thuoc ve
        const comments = await Comment.find().populate('blog').sort({ createdAt: -1 }); 
        res.json({ success: true, comments });// gui ve client du lieu cac comment
    } catch (error) {
        res.json({ success: false, message: error.message });   
    }
}

export const getDashboard = async (req, res) => {
    try {

      // lay 5 blog moi nhat tu database va sap xep theo thoi gian tao moi nhat o tren
      const recentBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5); 
      const blogs = await Blog.countDocuments(); // dem tong so blog trong database
      const comments = await Comment.countDocuments(); // lay tat ca cac comment tu database
      const drafts = await Blog.countDocuments({ isPublished: false }); // dem tong so bai viet nhap
      
      const dashboardData = {
        blogs, comments, recentBlogs,drafts
      };
      res.json({ success: true, data: dashboardData });// gui ve client du lieu dashboard
    } catch (error) {
        res.json({ success: false, message: error.message }); 
    }
}

export const deletecommentById = async (req, res) => {
    try {
        const { id } = req.body;// lay id tu body
        await Comment.findByIdAndDelete(id); // xoa comment theo id tu database
        res.json({ success: true, message: "Comment deleted successfully" });// gui ve client thong bao xoa comment thanh cong
    } catch (error) {
        res.json({ success: false, message: error.message }); // neu co loi thi gui ve client thong bao loi
     }
}

export const approveCommentById = async (req, res) => {
    try {
        const { id } = req.body;// lay id tu body
    await Comment.findByIdAndUpdate(id, { isApproved: true }); // cap nhat trang thai duyet comment
        res.json({ success: true, message: "Comment approved successfully" });// gui ve client thong bao xoa comment thanh cong
    } catch (error) {
        res.json({ success: false, message: error.message }); // neu co loi thi gui ve client thong bao loi
     }
}

// Xóa blog theo id
export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body;
        await Blog.findByIdAndDelete(id);
        res.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Cập nhật trạng thái publish của blog
export const updateBlogPublishStatus = async (req, res) => {
    try {
        const { id, isPublished } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(id, { isPublished }, { new: true });
        res.json({ success: true, message: "Blog publish status updated successfully", blog: updatedBlog });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
