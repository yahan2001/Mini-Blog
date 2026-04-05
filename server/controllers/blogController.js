import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";


export const createBlog = async (req, res) => {
    try {
        //nhan du lieu tu client
        const { title, subTitle, description, category, isPublished } = req.body;
        //kiem tra xem cac truong co duoc dien day du hay khong
        if (!title || !subTitle || !description || !category || isPublished === undefined) {
            return res.json({ success: false, message: "All fields are required" });
        }
        const fileBuffer = fs.readFileSync(image.path);

        //upload anh len imagekit va lay ve url cua anh do
        const response = await imagekit.upload({ 
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder : "/blog"
        });

        //tao url moi cho anh da duoc toi uu hoa de hien thi tren website nhanh hon
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: "auto"},// toi uu chat luong anh, hien thi nhanh hon
                {format: "webp"}, // chuyen anh sang webp de giam dung luong va tang toc do tai trang   
                {width:'1280'} // dat chieu rong toi da cho anh de hien thi tren website, giup tang toc do tai trang
            ]
        });

        //tao moi mot blog va luu tru trong database
        const image = optimizedImageUrl; 

        //luu tru blog moi trong database
        await Blog.create({ title, subTitle, description, category, image, isPublished });

        //gui ve client thong bao tao blog thanh cong
        res.json({ success: true, message: "Blog created successfully" });
    }
    //neu co looi thi gui ve cclient thong bao loi  
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// lay tat ca cac blog tu db gui ve client=> hien thi tren trang chu
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 }); // lay cac blog da publish
        res.json({ success: true, blogs });// gui ve client du lieu cac blog
    } catch (error) {
        // neu co loi thi gui ve client thong bao loi
        res.json({ success: false, message: error.message });//
    }
}

// lay mot blog theo id tu db gui ve client => hien thi chi tiet blog do
export const getBlogsById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id); // lay mot blog theo id tu database
        if (!blog) {
            // neu khong tim thay blog thi gui ve client thong bao khong tim thay
            return res.json({ success: false, message: "Blog not found" }); 
        }
        res.json({ success: true, data: blog });// gui ve client du lieu blog do
    } catch (error) {
        // neu co loi thi gui ve client thong bao loi
        res.json({ success: false, message: error.message });
    }
}

// xoa mot blog theo id tu db gui ve client thong bao xoa thanh cong
export const deleteBlogsById = async (req, res) => {
    try {
        const { id } = req.body; // lay id tu body
        if (!id) {
            return res.json({ success: false, message: "Blog id is required" });
        }

        const deletedBlog = await Blog.findByIdAndDelete(id); // xoa blog theo id tu database
        if (!deletedBlog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        res.json({ success: true, message: "Blog deleted successfully" });// gui ve client thong bao xoa blog thanh cong
    } catch (error) {
        // neu co loi thi gui ve client thong bao loi
        res.json({ success: false, message: error.message });
    }
}

export const updateBlogById = async (req, res) => {
    try {
        const { id, title, subTitle, description, category, isPublished } = req.body;
        if (!id) {
            return res.json({ success: false, message: "Blog id is required" });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (subTitle !== undefined) updateData.subTitle = subTitle;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (isPublished !== undefined) updateData.isPublished = isPublished;

        if (Object.keys(updateData).length === 0) {
            return res.json({ success: false, message: "No fields to update" });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedBlog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        res.json({ success: true, message: "Blog updated successfully", data: updatedBlog });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const togglePublishBlog = async (req, res) => {
    try {
        const { id } = req.body; // lay id tu body
        if (!id) {
            return res.json({ success: false, message: "Blog id is required" });
        }

        const blog = await Blog.findById(id); // tim blog theo id tu database
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        blog.isPublished = !blog.isPublished; // dao trang thai isPublished
        await blog.save(); // luu thay doi vao database
        res.json({ success: true, message: `Blog ${blog.isPublished ? "published" : "unpublished"} successfully` });// gui ve client thong bao trang thai moi cua blog
    }
    catch (error) {
        // neu co loi thi gui ve client thong bao loi
        res.json({ success: false, message: error.message });
    }
}
