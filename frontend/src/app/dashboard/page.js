'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    Promise.all([
      fetch('http://localhost:8080/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
      fetch('http://localhost:8080/api/courses/my', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
    ])
      .then(([userData, coursesData]) => {
        setUser(userData)
        setCourses(coursesData)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        localStorage.removeItem('token')
        router.push('/logIn')
      })
  }, [router])

  const handleContinue = async (courseId) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:8080/api/courses/${courseId}/lesson/last`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()

    if (data.lessonId) {
      alert(`Chuyển đến bài học: ${data.title} (lessonId: ${data.lessonId})`)
    } else {
      alert(data.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/logIn')
  }

  if (loading) return <p className="text-center mt-10 text-gray-600">Đang tải...</p>

  return (
    <div className="min-h-screen bg-gray-100">
      
      <nav className="flex justify-between items-center bg-blue-600 text-white px-6 py-3 shadow-md">
        <div className="space-x-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="hover:underline"
          >
            Khóa học của tôi
          </button>
          <button
            onClick={() => router.push('/courses')}
            className="hover:underline"
          >
            Tất cả khóa học
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="hover:underline"
          >
            Hồ sơ
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <span className="font-semibold">Xin chào, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Đăng xuất
          </button>
        </div>
      </nav>

      
      <h1 className="text-2xl font-bold text-center mt-6 text-gray-800">
        Khóa học của tôi
      </h1>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tiến độ: {course.progress}%
              </p>
              <button
                onClick={() => handleContinue(course.id)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Tiếp tục học
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
