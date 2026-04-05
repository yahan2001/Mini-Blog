import jwt from "jsonwebtoken";

// middleware de xac thuc token tu client gui len, kiem tra xem token co hop le hay khong
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization || ""; // lay token tu header Authorization cua request
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : authHeader.trim();

    if (!token) {
        return res.status(401).json({ success: false, message: "Missing token" });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET); // kiem tra xem token co hop le hay khong, neu hop le thi tiep tuc xu ly request
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
}

export default auth;