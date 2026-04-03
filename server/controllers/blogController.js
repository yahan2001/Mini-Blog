


export const createBlog = (req, res) => {
    try {
        //nhan du lieu tu client
        const { title, subTitle, description, category, image } = req.body;
        //kiem tra xem cac truong co duoc dien day du hay khong
        if (!title || !subTitle || !description || !category || !image) {
            return res.json({ success: false, message: "All fields are required" });
        }
        //tao moi mot blog moi va luu vao database
        const newBlog = new Blog({ title, subTitle, description, category, image });
        newBlog.save();
        res.json({ success: true, message: "Blog created successfully" }); //gui ve client mot thong bao thanh cong
    }
    //neu co looi thi gui ve cclient thong bao loi  
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}
