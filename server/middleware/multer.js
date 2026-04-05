import multer from "multer";

// xu ly upload anh tu client len server, su dung memoryStorage 
// de luu tru anh tam thoi trong bo nho cua server truoc khi upload len imagekit
const upload = multer({storage: multer.memoryStorage()});

export default upload;