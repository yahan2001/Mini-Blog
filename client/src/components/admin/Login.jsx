import React from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAppContext } from '../../context/useAppContext'

const Login = () => {

  const {setToken, setUser, navigate} = useAppContext();

  const [isRegister, setIsRegister] = React.useState(false)
  const [name, setName] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isRegister && password !== confirmPassword) {
      toast.error('Confirm password does not match')
      return
    }

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
      const payload = isRegister ? {name, username, email, password, confirmPassword} : {email, password}
      const {data} = await axios.post(endpoint, payload)
      if (data.success) {
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        navigate(data.user.role === 'admin' ? '/admin' : '/admin/addBlog')
      }
    else {
      toast.error(data.message)
    }
    } catch (error) {
       toast.error(error.response?.data?.message || error.message)
    }
      }
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-md p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg'>
        <div className='w-full py-6 text-center'>
          <h1 className='text-3xl font-bold'>
            {isRegister ? (
              <><span className='text-primary'>Author</span> Register</>
            ) : (
              <><span className='text-primary'>Sign</span> in</>
            )}
          </h1>
          <p className='font-light'>
            {isRegister ? 'Create an author account to write and comment' : 'Enter your credentials to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='mt-6 w-full sm:max-w-md text-gray-600'>
          {isRegister && (
            <>
              <div className='flex flex-col'>
                <label>Full name</label>
                <input
                  onChange={e=> setName(e.target.value)} value={name}
                  type="text" required placeholder='your full name' className='border-b-2 border-gray-300 p-2 outline-none mb-6' />
              </div>

              <div className='flex flex-col'>
                <label>Username</label>
                <input
                  onChange={e=> setUsername(e.target.value)} value={username}
                  type="text" required placeholder='your username' className='border-b-2 border-gray-300 p-2 outline-none mb-6' />
              </div>
            </>
          )}

          <div className='flex flex-col'>
            <label>Email</label>
            <input 
            onChange={e=> setEmail (e.target.value)} value ={email}
             type="email" required placeholder='your email id' className='border-b-2 border-gray-300 p-2 outline-none mb-6' />
          </div>

          <div className='flex flex-col'>
            <label>Password</label>
            <input 
            onChange={e=> setPassword (e.target.value)} value ={password}
            type="password" required placeholder='your password' className='border-b-2 border-gray-300 p-2 outline-none mb-6' />
          </div>

          {isRegister && (
            <div className='flex flex-col'>
              <label>Confirm password</label>
              <input
                onChange={e=> setConfirmPassword(e.target.value)} value={confirmPassword}
                type="password" required placeholder='confirm your password' className='border-b-2 border-gray-300 p-2 outline-none mb-6' />
            </div>
          )}

          <button type='submit' className='w-full py-3 font-medium text-white bg-primary rounded cursor-pointer hover:bg-primary/90 transition-all'>
            {isRegister ? 'Create author account' : 'Login'}
          </button>
          <button type='button' onClick={() => setIsRegister(!isRegister)} className='mt-4 w-full text-sm text-primary cursor-pointer'>
            {isRegister ? 'Already have an account? Login' : 'Need an author account? Register'}
          </button>
        </form>

      </div>
    </div>
  )
}

export default Login
