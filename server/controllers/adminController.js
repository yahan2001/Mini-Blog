import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import imagekit from '../configs/imageKit.js'; 

// 1. Login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
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

    const { title, subTitle, description, category } = parsedBlog;
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