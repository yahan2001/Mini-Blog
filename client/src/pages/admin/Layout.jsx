import React from 'react'
import { Outlet } from 'react-router-dom'
import PublicSidebar from '../../components/PublicSidebar'
const Layout = () => {  
  return (
      <div className='min-h-screen bg-gray-50 lg:flex'>
        <PublicSidebar />
        <Outlet />
      </div>
  )
}

export default Layout
