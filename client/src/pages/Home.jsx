import React from 'react'
import Header from '../components/Header'
import Bloglist from '../components/Bloglist'
import PublicSidebar from '../components/PublicSidebar'
import { useAppContext } from '../context/useAppContext'
const Home = () => {
  const { input } = useAppContext()
  const isSearching = input.trim().length > 0

  return (
    <div className='min-h-screen bg-gray-50 lg:flex'>
        <PublicSidebar />
        <main className='flex-1'>
            {!isSearching && <Header />}
            <Bloglist />
        </main>
    </div>
  )
}

export default Home
