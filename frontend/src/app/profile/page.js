"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/header";
import Footer from "@/components/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
    const [image, setImage] = useState(null); // lưu URL xem trước
    const [user, setUser] = useState({ name: '', email: '' });
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // lấy file đầu tiên
        if (file) {
            const imageUrl = URL.createObjectURL(file); // tạo URL tạm
            setImage(imageUrl);
        }
    };

    // Lấy thông tin người dùng hiện tại
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Vui lòng đăng nhập lại');
            return;
        }

        fetch('http://localhost:8080/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.id) {
                    setUser({ name: data.name, email: data.email });
                } else {
                    setMessage(data.message || 'Không thể tải thông tin người dùng');
                }
            })
            .catch(() => setMessage('Lỗi khi kết nối server'));
    }, []);

    // Hàm xử lý cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Bạn chưa đăng nhập');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/auth/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    password: password || undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setMessage(data.message || 'Cập nhật thất bại');
                return;
            }

            setMessage('Cập nhật thành công 🎉');
            localStorage.setItem('user', JSON.stringify(data.user));
            setPassword('');
        } catch (err) {
            setMessage('Lỗi kết nối server');
        }
    };

    return (
        <>
            <main className="h-screen w-screen">
                <Sidebar />
                <div className="h-screen ml-[50px] pt-10 px-15">
                    <div className="min-w-[700px] p-10 rounded-4xl">
                        <h1 className="text-4xl font-semibold text-center mb-10 font-montserrat text-indigo-500">Thông tin cá nhân</h1>
                        <div className="flex flex-row justify-evenly max-w-[800px] mx-auto gap-3">
                            <div className="inline-block">
                                <img src={image || "/no_avatar.jpg"}
                                    alt="Ảnh đại diện"
                                    className="w-32 !aspect-square rounded-full object-cover mb-4 shadow"></img>
                                <div className="w-full p-1 bg-indigo-300 rounded-lg text-black font-medium shadow-lg hover:shadow-none transition-colors duration-200 ease-in-out hover:bg-indigo-400 cursor-pointer text-center">Tải ảnh lên</div>
                            </div>
                            <form action="#" className="mx-auto max-w-[800px] min-w-[600px] gap-3 inline-block">
                                <div className="w-full">
                                    <div className="mb-3 w-full">
                                        <label className="block text-indigo-900/80 font-semibold mb-1">Tên:</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={user.name}
                                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                                            className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3 w-full">
                                        <label className="block text-indigo-900/80 font-semibold mb-1">Email:</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={user.email}
                                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                                            className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3 w-full">
                                        <label className="block text-indigo-900/80 font-semibold mb-1">Số điện thoại:</label>
                                        <input
                                            type="tel"
                                            name="tel"
                                            value={user.email}
                                            onChange={(e) => setUser({ ...user, tel: e.target.value })}
                                            className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3 w-full">
                                        <label className="block text-indigo-900/80 font-semibold mb-1">Mật khẩu cũ (tuỳ chọn):</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                                        />
                                    </div>

                                    <div className="mb-3 w-full">
                                        <label className="block text-indigo-900/80 font-semibold mb-1">Mật khẩu mới (tuỳ chọn):</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full border border-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex justify-end">
                                    <button type="submit" className=" bg-green-400 from-35% py-1 px-3 rounded-lg border-green-300 border-2 shadow-lg mt-2 font-medium transition-[colors, shadow] duration-150 hover:bg-green-500 hover:shadow-none cursor-pointer">
                                        <FontAwesomeIcon icon={faFloppyDisk} className="mr-1"></FontAwesomeIcon>
                                        Lưu thông tin
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <Footer />
                </div>
            </main>

        </>
    );
}