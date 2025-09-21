'use client'
import { useState } from "react"
import { useRouter } from 'next/navigation'
export default function signIn() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        if (formData.password !== formData.confirmPassword) {
            setMessage("Mật khẩu không khớp");
            return;
        }
        console.log('aaaaa');
        try {
            const res = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            console.log(res);
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                setMessage("Đăng ký thành công!");
                router.push("/logIn");
                console.log('Token', data.token);
            } else {
                setMessage(data.message || "Có lỗi xảy ra");
            }
            
        } catch (err) {
            console.error(err);
            setMessage("Lỗi");
        }
    }
    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label>Name: </label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <label>Email: </label>
                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label>Password: </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <label>Confirm Password: </label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Đăng kí</button>
            </form>
        </div>
    )
}