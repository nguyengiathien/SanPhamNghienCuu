const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const fs = require('fs');
const path = require('path');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

const SECRET_KEY = 'abcd';

// Duong dan den userData.json
const dataUserPath = './data/userData.json';

// read userData.json
async function readUsers() {
    const data = await fs.promises.readFile(dataUserPath, 'utf8');
    return JSON.parse(data);
}

// write userData.json
async function saveUsers(users) {
    await fs.promises.writeFile(dataUserPath, JSON.stringify(users, null, 2));
}

// ------------------------ SIGN UP --------------------
router.post('/signup', async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword, role } = req.body;
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
        }
        if (password != confirmPassword) {
            return res.status(400).json({ message: "Mật khẩu không khớp" });
        }
        const users = await readUsers();
        const existingUser = users.find(u => email === u.email)
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //add new user
        const newUser = {
            id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        };

        users.push(newUser);
        const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role },
            SECRET_KEY,
            { expiresIn: '5h' }
        );

        res.status(201).json({
            message: 'Đăng kí thành công',
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
            token
        });
        await saveUsers(users);
    } catch (err) {
        next(err)
    }
})
// ------------------------ LOGIN --------------------
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" })
        }

        const users = await readUsers();
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại' });
        }
        const isMatch = user.password.startsWith('$2a$')
            ? await bcrypt.compare(password, user.password)
            : password === user.password;
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu không chính xác' });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: '5h' }
        );

        res.status(200).json({
            message: 'Đăng nhập thành công',
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (err) {
        next(err);
    }
});

// ------------------------ LẤY THÔNG TIN CÁ NHÂN --------------------
router.get('/me', verifyToken, async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// ------------------------ CHỈNH SỬA THÔNG TIN CÁ NHÂN --------------------
router.put('/me', verifyToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const users = await readUsers();
    const index = users.findIndex(u => u.id === req.user.id);
    if (index === -1) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    // Cập nhật thông tin
    if (name) users[index].name = name;
    if (email) users[index].email = email;
    if (password) users[index].password = await bcrypt.hash(password, 10);

    await saveUsers(users);

    res.json({
      message: 'Cập nhật thông tin thành công',
      user: { id: users[index].id, name: users[index].name, email: users[index].email, role: users[index].role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});
module.exports = router;