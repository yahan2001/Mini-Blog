import React from 'react'
import { useLocation } from 'react-router-dom'
import {
  FiBell,
  FiBookOpen,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiEdit2,
  FiFileText,
  FiHome,
  FiMonitor,
  FiSearch,
  FiMessageCircle,
} from 'react-icons/fi'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/useAppContext'

const PublicSidebar = () => {
  const { navigate, token, user, input, setInput, setToken, setUser, axios } = useAppContext()
  const location = useLocation()
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false)
  const [notifications, setNotifications] = React.useState([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const displayName = user?.name || 'Sign in'

  const navItems = [
    { label: 'Home', path: '/', icon: FiHome },
    { label: 'Blogs', path: '/my-blogs', icon: FiBookOpen },
    { label: 'Search', path: '/', icon: FiSearch },
  ]

  const authorItems = [
    { label: 'Write', path: token ? '/admin/addBlog' : '/admin', icon: FiEdit2 },
    { label: 'Drafts', path: token ? '/drafts' : '/admin', icon: FiFileText },
  ]

  const handleNav = (item) => {
    if (item.label === 'Search') {
      navigate('/')
      setTimeout(() => window.dispatchEvent(new Event('open-search-modal')), 0)
      return
    }
    navigate(item.path)
  }

  const isActiveNav = (item) => {
    if (item.label === 'Search') return Boolean(input)
    return location.pathname === item.path
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setNotifications([])
    setUnreadCount(0)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const fetchNotifications = React.useCallback(async () => {
    if (!token) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    try {
      const { data } = await axios.get('/api/notifications')
      if (data.success) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Fetch notifications error:', error.message)
    }
  }, [axios, token])

  React.useEffect(() => {
    fetchNotifications()
    if (!token) return

    const timer = setInterval(fetchNotifications, 30000)
    return () => clearInterval(timer)
  }, [fetchNotifications, token])

  const openNotifications = async () => {
    if (!token) {
      navigate('/admin')
      return
    }

    setIsNotificationOpen(!isNotificationOpen)
    await fetchNotifications()

    if (unreadCount > 0) {
      try {
        await axios.post('/api/notifications/read')
        setUnreadCount(0)
      } catch (error) {
        console.error('Mark notifications read error:', error.message)
      }
    }
  }

  const goToNotification = (notification) => {
    setIsNotificationOpen(false)
    if (notification.blog?.slug || notification.blog?._id) {
      navigate(`/blog/${notification.blog.slug || notification.blog._id}`)
    }
  }

  const renderIcon = (Icon, isActive = false) => (
    <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
  )

  const renderSidebarItem = (item, onClick, isActive) => (
    <button
      key={item.label}
      onClick={onClick}
      title={isCollapsed ? item.label : ''}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left hover:bg-primary/5 cursor-pointer ${
        isActive ? 'bg-primary/5 text-primary font-medium' : 'text-gray-700'
      }`}
    >
      <span className='flex w-7 justify-center'>{renderIcon(item.icon, isActive)}</span>
      {!isCollapsed && item.label}
      {!isCollapsed && item.label === 'Search' && (
        <span className='ml-auto rounded-full border border-gray-200 bg-gray-50 px-3 py-0.5 text-xs text-gray-400'>⌘ k</span>
      )}
    </button>
  )

  return (
    <aside className={`bg-white border-r border-gray-200 lg:sticky lg:top-0 lg:h-screen flex lg:flex-col justify-between transition-all duration-200 ${
      isCollapsed ? 'lg:w-20' : 'lg:w-72'
    }`}>
      <div className='w-full lg:overflow-y-auto'>
        <div className='flex items-center justify-between gap-3 px-5 py-5'>
          {isCollapsed ? (
            <button onClick={() => navigate('/')} className='hidden lg:flex h-10 w-10 items-center justify-center rounded-full bg-primary cursor-pointer'>
              <span className='h-3 w-3 rounded-full bg-white'></span>
            </button>
          ) : (
            <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='w-32 cursor-pointer' />
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className='hidden lg:block text-3xl text-gray-400 hover:text-gray-700 cursor-pointer'>
            {isCollapsed ? <FiChevronRight className='h-6 w-6' /> : <FiChevronLeft className='h-6 w-6' />}
          </button>
          <button onClick={() => navigate('/admin')} className='lg:hidden text-sm px-4 py-2 bg-primary text-white rounded cursor-pointer'>
            {token ? 'Admin' : 'Login'}
          </button>
        </div>

        <div className='hidden lg:block px-4 py-5'>
          {navItems.map((item) => renderSidebarItem(item, () => handleNav(item), isActiveNav(item)))}

          {!isCollapsed && <p className='mt-8 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase'>Author</p>}
          {authorItems.map((item) => renderSidebarItem(item, () => navigate(item.path), location.pathname === item.path))}
        </div>

        <div className='lg:hidden flex gap-2 overflow-x-auto px-4 py-3 border-b border-gray-100'>
          {[...navItems, ...authorItems].map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item)}
              className='shrink-0 px-4 py-2 border border-gray-200 rounded text-sm text-gray-600'
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className='hidden lg:block px-5 py-5'>
        {input && !isCollapsed && (
          <button onClick={() => setInput('')} className='mb-3 w-full border border-gray-200 px-4 py-2 rounded text-sm text-gray-600 cursor-pointer'>
            Clear search
          </button>
        )}
        <div className='relative'>
          <button onClick={openNotifications} title={isCollapsed ? 'Notifications' : ''} className='w-full flex items-center gap-3 px-4 py-3 rounded text-left text-gray-700 hover:bg-primary/5 cursor-pointer'>
            <span className='relative flex w-7 justify-center'>
              <FiBell className='h-5 w-5 text-gray-500' />
              {unreadCount > 0 && <span className='absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-primary'></span>}
            </span>
            {!isCollapsed && 'Notifications'}
            {!isCollapsed && unreadCount > 0 && <span className='ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-white'>{unreadCount}</span>}
          </button>
          {isNotificationOpen && (
            <div className='absolute bottom-full left-full z-50 mb-2 w-96 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg'>
              <div className='flex items-center justify-between border-b border-gray-200 px-5 py-4'>
                <p className='font-semibold text-gray-900'>Notifications</p>
                <button onClick={() => setIsNotificationOpen(false)} className='text-gray-400 hover:text-gray-700 cursor-pointer'>×</button>
              </div>
              <div className='max-h-96 overflow-y-auto'>
                {notifications.length > 0 ? notifications.map((notification) => (
                  <button
                    key={notification._id}
                    onClick={() => goToNotification(notification)}
                    className='w-full flex gap-3 border-b border-gray-100 px-5 py-4 text-left hover:bg-gray-50 cursor-pointer'
                  >
                    <span className='mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary'>
                      {notification.type === 'comment' ? <FiMessageCircle className='h-5 w-5' /> : <FiHeart className='h-5 w-5' />}
                    </span>
                    <span>
                      <span className='block text-sm font-medium text-gray-900'>{notification.message}</span>
                      <span className='mt-1 block text-xs text-gray-400'>{new Date(notification.createdAt).toLocaleString()}</span>
                    </span>
                  </button>
                )) : (
                  <div className='px-5 py-10 text-center text-gray-500'>No notifications yet.</div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className='relative'>
          <button onClick={() => navigate(token ? '/profile' : '/admin')} title={isCollapsed ? displayName : ''} className={`mt-2 w-full flex items-center gap-3 px-4 py-3 rounded text-left hover:bg-primary/5 cursor-pointer ${
            location.pathname === '/profile' ? 'bg-primary/5 text-primary font-medium' : 'text-gray-700'
          }`}>
            <span className='flex h-6 w-6 items-center justify-center rounded-full bg-primary text-sm text-white'>H</span>
            {!isCollapsed && displayName}
            {!isCollapsed && <FiMonitor className='ml-auto h-5 w-5 text-gray-700' />}
          </button>
        </div>
        {!isCollapsed && <button onClick={logout} className='mt-2 w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-red-500 cursor-pointer'>
          Sign out
        </button>}
        {!isCollapsed && <div className='mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-sm text-gray-400'>
          <span>Terms</span>
          <span>Privacy</span>
          <span>Sitemap</span>
          <span>Shortcuts</span>
          <span className='w-full'>© 2026 LinearBytes Inc.</span>
        </div>}
      </div>
    </aside>
  )
}

export default PublicSidebar
