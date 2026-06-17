import { useState, useEffect } from "react";
import axios from "axios";// import axios de thuc hien cac yeu cau HTTP den server
import { useNavigate } from "react-router-dom";// import useNavigate de dieu huong nguoi dung sau khi thuc hien mot hanh dong nhat dinh
import toast from "react-hot-toast";
import { AppContext } from './AppContextCore'

// dat baseURL cho axios tu bien moi truong, neu khong co thi mac dinh la localhost:3000
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000"; 

export const AppProvider = ({ children }) => {

    // su dung hook useNavigate de dieu huong nguoi dung 
    // sau khi thuc hien mot hanh dong nhat dinh
    const navigate = useNavigate(); 

    const [token, setToken] = useState(() => localStorage.getItem("token")); // tao state de luu tru token dang nhap cua nguoi dung
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    }); // luu thong tin user dang nhap
    const [blogs, setBlogs] = useState([]); // tao state de luu tru danh sach cac blog, mac dinh la mot mang rong
    const [input, setInput] = useState(""); // tao state de luu tru gia tri cua input tim kiem, mac dinh la mot chuoi rong

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [token])

    useEffect(() => {
        if (token && !user) {
            axios.get('/api/auth/me').then(({data}) => {
                if (data.success) {
                    setUser(data.user);
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
            }).catch(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setToken(null);
                setUser(null);
            });
        }
    }, [token, user])

    useEffect(() => {
        let isMounted = true;

        axios.get('/api/blog/all')
            .then(({ data }) => {
                if (!isMounted) return;
                data.success ? setBlogs(data.blogs) : toast.error(data.message);
            })
            .catch((error) => {
                if (isMounted) toast.error(error.message);
            });

        return () => {
            isMounted = false;
        }
    }, [])

    return (
        <AppContext.Provider value={{ token, setToken, user, setUser, blogs, setBlogs, input, setInput, navigate, axios }}>
            {children}
        </AppContext.Provider>
    ); 
}
