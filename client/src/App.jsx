import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Dashboard from './pages/admin/Dashboard'
import Layout from './pages/admin/Layout'
import AddBlog from './pages/admin/AddBlog'
import Comment from './pages/admin/Comment'
import ListBlog from './pages/admin/ListBlog'
import Login from './components/admin/Login'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'


const App = () => {
  const {token} = useAppContext(); // su dung hook useAppContext de lay gia tri token tu context de kiem tra trang thai dang nhap cua nguoi dung
  
  return (
    <div>
      {/* <Toaster position='top-right' reverseOrder={false} />  */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path='/admin' element={token ? <Layout /> : <Login/> } > {/* neu nguoi dung da dang nhap (co token) thi hien thi component Layout, nguoc lai hien thi component Login de nguoi dung dang nhap */}
          <Route index element={<Dashboard />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path='editBlog/:id' element={<AddBlog />} />
          <Route path='comments' element={<Comment />} />
          <Route path='listBlogs' element={<ListBlog />} />
        </Route>
      </Routes>
    </div>
  )
  
}

export default App
