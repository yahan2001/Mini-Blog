import React from 'react'
import { assets } from '../../assets/assets'
import { div } from 'framer-motion/client'
import { useNavigate } from 'react-router-dom'

const Layout = () => {
    const navigate = useNavigate()
  return (
    <>
      <div>
        <img src={assets.logo} alt="" className ='w-32 sm:w-40 cursor-pointer' />
        onClick={() => navigate('/')}
        <button>Logout</button>
      </div>
    </>
  )
}

export default Layout