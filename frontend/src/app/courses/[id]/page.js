"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CourseDetail() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
    const router = useRouter();

    // Lấy thông tin khóa học
    useEffect(() => {
        fetch(`http://localhost:8080/api/courses/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setCourse(data);
                setReviews(data.reviews || []);
            });
    }, [id]);

    // Kiểm tra user đã tham gia chưa
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`http://localhost:8080/api/courses/my`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                const enrolled = data.some((c) => c.id === Number(id));
                setIsEnrolled(enrolled);
            })
            .catch(() => { });
    }, [id]);

    const handleAction = () => {
        if (isEnrolled) {
            // 👉 Nếu đã tham gia thì chuyển đến bài học gần nhất
            router.push(`/courses/${id}/learn`);
        } else if (course.price && course.price !== "Miễn phí") {
            // 👉 Nếu có phí thì chuyển sang trang thanh toán
            router.push(`/checkout?courseId=${id}`);
        } else {
            // 👉 Nếu miễn phí thì đăng ký ngay
            handleRegister();
        }
    };

    const handleRegister = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        const res = await fetch(
            `http://localhost:8080/api/courses/${id}/register`,
            {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await res.json();
        alert(data.message);
        if (res.ok) setIsEnrolled(true);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const res = await fetch(
            `http://localhost:8080/api/courses/${id}/reviews`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newReview),
            }
        );
        const data = await res.json();
        if (res.ok) {
            setReviews((prev) => [...prev, data]);
            setNewReview({ rating: 5, comment: "" });
        } else {
            alert(data.message);
        }
    };

    if (!course) return <p className="p-6">Đang tải...</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <img
                src={course.image}
                alt={course.title}
                className="w-full h-64 object-cover rounded mb-4"
            />
            <p className="mb-4">{course.description}</p>
            <p className="mb-2 font-semibold">Giá: {course.price}</p>
            <p className="mb-2">Giảng viên: {course.instructor}</p>
            <p className="mb-2">Thời lượng: {course.duration}</p>
            <p className="mb-2">Đánh giá trung bình: ⭐ {`${course.rating}/5`}</p>
            <p className="mb-4 font-semibold text-blue-600">
                Tiến độ: {course.progress}%
            </p>
            <button
                onClick={handleAction}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
                {isEnrolled
                    ? "Tiếp tục học"
                    : course.price && course.price !== "Miễn phí"
                        ? "Đăng ký học"
                        : "Tham gia ngay"}
            </button>

            <h2 className="text-xl font-bold mt-6 mb-2">Danh sách bài học</h2>
            <ul className="list-disc ml-6">
                {course.lessons.map((l) => (
                    <li key={l.id}>
                        {l.title} {l.completed ? "✅" : "❌"}
                    </li>
                ))}
            </ul>


            <h2 className="text-xl font-bold mt-6 mb-2">Đánh giá khóa học</h2>
            <div className="space-y-4">
                {reviews.length > 0 ? (
                    reviews.map((r, idx) => (
                        <div key={idx} className="border p-3 rounded">
                            <p className="font-semibold">⭐ {r.rating}</p>
                            <p>{r.comment}</p>
                        </div>
                    ))
                ) : (
                    <p>Chưa có đánh giá nào</p>
                )}
            </div>

            {isEnrolled && (
                <form
                    onSubmit={handleReviewSubmit}
                    className="mt-6 border-t pt-4 space-y-3"
                >
                    <h3 className="font-bold">Viết đánh giá của bạn</h3>
                    <select
                        value={newReview.rating}
                        onChange={(e) =>
                            setNewReview({ ...newReview, rating: Number(e.target.value) })
                        }
                        className="border p-2 rounded"
                    >
                        {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>
                                {r} sao
                            </option>
                        ))}
                    </select>
                    <textarea
                        value={newReview.comment}
                        onChange={(e) =>
                            setNewReview({ ...newReview, comment: e.target.value })
                        }
                        placeholder="Nhập bình luận..."
                        className="w-full border p-2 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Gửi đánh giá
                    </button>
                </form>
            )}
        </div>
    );
}
