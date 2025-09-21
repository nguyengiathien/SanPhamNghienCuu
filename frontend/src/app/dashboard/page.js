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
        router.push('/login')
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
    router.push('/login')
  }

  if (loading) return <p>Đang tải...</p>

  return (
    <div>
      
      <nav>
        <div>
          <button onClick={() => router.push('/dashboard')}>Khóa học của tôi</button>
          <button onClick={() => router.push('/all-courses')}>Tất cả khóa học</button>
          <button onClick={() => router.push('/profile')}>Hồ sơ</button>
        </div>
        <div>
          <span>Xin chào, {user?.name}</span>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Đăng xuất</button>
        </div>
      </nav>

      
      <h1>Khóa học của tôi</h1>

      
      <div>
        {courses.map(course => (
          <div key={course.id} >
            <img src={course.image} alt={course.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h3>{course.title}</h3>
            <p>Tiến độ: {course.progress}%</p>
            <button onClick={() => handleContinue(course.id)}>Tiếp tục học</button>
          </div>
        ))}
      </div>
    </div>
  )
}
