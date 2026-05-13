import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";// import axios de thuc hien cac yeu cau HTTP den server
import { useNavigate } from "react-router-dom";// import useNavigate de dieu huong nguoi dung sau khi thuc hien mot hanh dong nhat dinh
import toast from "react-hot-toast";

// dat baseURL cho axios tu bien moi truong, neu khong co thi mac dinh la localhost:3000
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000"; 

const AppContext = createContext();// tao context de chia se du lieu giua cac component trong ung dung

export const AppProvider = ({ children }) => {

    // su dung hook useNavigate de dieu huong nguoi dung 
    // sau khi thuc hien mot hanh dong nhat dinh
    const navigate = useNavigate(); 

    const [token, setToken] = useState( null); // tao state de luu tru token dang nhap cua nguoi dung, mac dinh la null
    const [blogs, setBlogs] = useState([]); // tao state de luu tru danh sach cac blog, mac dinh la mot mang rong
    const [input, setInput] = useState(""); // tao state de luu tru gia tri cua input tim kiem, mac dinh la mot chuoi rong

    // tao ham fetchBlogs de lay danh sach cac blog tu server
    const fetchBlogs = async () =>{
        try{
            const{data} =await axios.get ('/api/blog/all');
            data.success ? setBlogs(data.blogs) : toast.error(data.message);

        }catch(error){
            toast.error(error.message);
        } 
    }
    useEffect(() => {
        console.log('AppContext useEffect started')
        const storedToken = localStorage.getItem("token"); // lay token tu localStorage neu co
        console.log('Token from localStorage:', storedToken)
        if (storedToken) {
            setToken(storedToken); // cap nhat state token neu co token trong localStorage
            axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`; // dat header Authorization cho axios de gui token trong cac yeu cau sau nay
            console.log('Token set in axios headers:', axios.defaults.headers.common["Authorization"])
        }
        fetchBlogs();

    },[])

    // tao mot doi tuong value chua tat ca cac state va ham setState
    // de cung cap cho cac component con co the su dung
    const value = { token, setToken, blogs, setBlogs, input, setInput, navigate, axios};

    // tra ve component AppContext.Provider de cung cap gia tri cua context cho cac component con co the su dung
    return (
        <AppContext.Provider value={{ token, setToken, blogs, setBlogs, input, setInput, navigate, axios }}>
            {children}
        </AppContext.Provider>
    ); 
    
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;// tra ve gia tri cua context de cac component con co the su dung
}