import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Dashboard from './pages/admin/Dashboard'
import Layout from './pages/admin/Layout'
import AddBlog from './pages/admin/AddBlog'
import Comment from './pages/admin/Comment'
import ListBlog from './pages/admin/ListBlog'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path='/admin' element={<Layout />} >
          <Route index element={<Dashboard />} />
          <Route path='addBlog' element={<AddBlog />} />
          <Route path='comments' element={<Comment />} />
          <Route path='listBlogs' element={<ListBlogs />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App