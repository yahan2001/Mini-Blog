import React from 'react'
import toast from 'react-hot-toast'
import { FiCalendar, FiInfo, FiUser } from 'react-icons/fi'
import PublicSidebar from '../components/PublicSidebar'
import { useAppContext } from '../context/useAppContext'

const getProfileFormData = (user) => ({
  name: user?.name || '',
  username: user?.username || user?.email?.split('@')[0] || 'user',
  tagline: user?.tagline || '',
  about: user?.about || '',
  availableFor: user?.availableFor || ''
})

const Profile = () => {
  const { user, axios, setToken, setUser, token, navigate } = useAppContext()
  const [isSaving, setIsSaving] = React.useState(false)
  const [formData, setFormData] = React.useState(() => getProfileFormData(user))

  React.useEffect(() => {
    if (!token) {
      navigate('/admin')
      return
    }

    setFormData(getProfileFormData(user))
  }, [navigate, token, user])

  const displayName = user?.name || 'User'
  const username = formData.username || 'user'
  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const saveProfile = async (e) => {
    e.preventDefault()

    try {
      setIsSaving(true)
      const { data } = await axios.put('/api/auth/me', formData)
      if (data.success) {
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 lg:flex'>
      <PublicSidebar />
      <main className='flex-1 p-4 sm:p-8 lg:p-10'>
        <div className='min-h-[calc(100vh-5rem)] bg-white border border-gray-200 rounded-lg shadow-sm p-6 sm:p-10'>
          <p className='font-semibold text-gray-800'>@{username}</p>

          <div className='mt-16 flex flex-col gap-6 border-b border-gray-200 pb-10 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-6'>
              <span className='flex h-32 w-32 items-center justify-center rounded-full bg-primary text-6xl text-white ring-4 ring-gray-100'>{displayName.charAt(0).toUpperCase()}</span>
              <div>
                <h1 className='text-3xl font-semibold text-gray-900'>{displayName}</h1>
                <p className='mt-1 text-gray-500'>@{username}</p>
                <p className='mt-4 text-primary'>{formData.tagline || 'Add a tagline'}</p>
                <p className='mt-3 flex items-center gap-2 text-gray-500'><FiCalendar /> Joined {joinedDate}</p>
              </div>
            </div>
          </div>

          <div className='mt-10 max-w-3xl'>
            <form onSubmit={saveProfile} className='space-y-6'>
              <div className='rounded-lg border border-gray-200 p-6'>
                <div className='flex items-center gap-4'>
                  <span className='flex h-11 w-11 items-center justify-center rounded-full bg-primary/5 text-primary'><FiUser /></span>
                  <h2 className='text-xl font-semibold text-gray-900'>Edit profile</h2>
                </div>

                <label className='mt-6 block text-sm font-medium text-gray-600'>Name</label>
                <input name='name' value={formData.name} onChange={handleChange} className='mt-2 w-full rounded border border-gray-200 px-4 py-3 outline-primary' />

                <label className='mt-4 block text-sm font-medium text-gray-600'>Username</label>
                <input name='username' value={formData.username} onChange={handleChange} className='mt-2 w-full rounded border border-gray-200 px-4 py-3 outline-primary' />

                <label className='mt-4 block text-sm font-medium text-gray-600'>Tagline</label>
                <input name='tagline' value={formData.tagline} onChange={handleChange} placeholder='Add a short tagline' className='mt-2 w-full rounded border border-gray-200 px-4 py-3 outline-primary' />

                <button disabled={isSaving} className='mt-6 rounded bg-primary px-5 py-3 font-medium text-white hover:bg-primary/90 disabled:opacity-60 cursor-pointer'>
                  {isSaving ? 'Saving...' : 'Save profile'}
                </button>
              </div>

              <div className='rounded-lg border border-gray-200 p-6'>
                <div className='flex items-center gap-4'>
                  <span className='flex h-11 w-11 items-center justify-center rounded-full bg-primary/5 text-primary'><FiInfo /></span>
                  <h2 className='text-xl font-semibold text-gray-900'>About</h2>
                </div>
                <textarea name='about' value={formData.about} onChange={handleChange} placeholder='Tell others about yourself.' className='mt-6 h-32 w-full resize-none rounded border border-gray-200 px-4 py-3 outline-primary' />

                <label className='mt-4 block text-sm font-medium text-gray-600'>Available for</label>
                <textarea name='availableFor' value={formData.availableFor} onChange={handleChange} placeholder="Let people know what you're open to." className='mt-2 h-24 w-full resize-none rounded border border-gray-200 px-4 py-3 outline-primary' />
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
