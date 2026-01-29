import React, { useState } from 'react'
import axios from "axios"
import Swal from "sweetalert2"
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        'https://jobportalassignmentbackend-1.onrender.com/api/login',
        formData,
        {
          headers: { "Content-Type": "application/json" }
        }
      )

      Swal.fire('User logged in successfully')
      localStorage.setItem('token', response.data.token)

      setTimeout(() => {
        navigate('/')
      }, 1500)

    } catch (error) {
      Swal.fire('Login failed', error.response?.data?.message || 'Something went wrong', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8 text-center">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-blue-100 mt-2 text-sm">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2"
                  />
                  Remember me
                </label>

                <span
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
                >
                  Forgot Password?
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 text-center text-sm text-gray-500">
              Or continue with
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="border py-3 rounded-lg hover:bg-gray-50">
                Google
              </button>
              <button className="border py-3 rounded-lg hover:bg-gray-50">
                Facebook
              </button>
            </div>
          </div>

          {/* Register */}
          <div className="px-8 py-6 bg-gray-50 border-t text-center text-sm text-gray-600">
            Don't have an account?
            <span
              onClick={() => navigate('/register')}
              className="ml-2 text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              Sign Up
            </span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">Terms</a> &{' '}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>

      </div>
    </div>
  )
}

export default Login
