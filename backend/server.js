const express = require('express')
const cors = require('cors');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const app = express();
const PORT = 8080;
const SECRET_KEY = 'abcd'

//middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());


//database
const adminHashedPassword = bcrypt.hashSync("123", 10);
let users = [{ id: 1, name: "admin", email: "admin@gmail.com", password: adminHashedPassword }];
let nextUserId = 2;

//API dang ki
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
        }
        if (password != confirmPassword) {
            return res.status(400).json({ message: 'Mật khẩu không khớp' });
        }

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email đã được sử dụng' });
        }
        console.log(existingUser);
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // add user mới
        const newUser = {
            id: nextUserId++,
            name,
            email,
            password: hashedPassword
        };
        users.push(newUser);
        console.log("📌 Danh sách user hiện tại:", users);
        //
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '5h' });

        res.status(201).json({
            message: 'Đăng kí thành công',
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API đăng nhập
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '5h' });

    res.json({
        message: 'Đăng nhập thành công',
        user: { id: user.id, name: user.name, email: user.email },
        token
    });
});

// --- Middleware xác thực token ---
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// --- API lấy danh sách người dùng (chỉ cho user đăng nhập) ---
app.get('/api/users', authenticateToken, (req, res) => {
    const safeUsers = users.map(u => ({ id: u.id, name: u.name, email: u.email }));
    res.json(safeUsers);
});

// APP reviews
app.post("/api/courses/:id/reviews", authenticateToken, (req, res) => {
    const { rating, comment } = req.body;
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).json({ message: "Không tìm thấy khóa học" });

    const review = {
        userId: req.user.id,
        name: users.find(u => u.id === req.user.id)?.name || "Ẩn danh",
        rating,
        comment,
        date: new Date()
    };
    course.reviews = course.reviews || [];
    course.reviews.push(review);

    res.json({ message: "Đánh giá thành công", review });
});

//API lọc trong trang courses
app.get("/api/categories", (req, res) => {
  const uniqueCategories = [...new Set(courses.map(c => c.category || "Khác"))];
  res.json(uniqueCategories);
});

// --- API đăng ký khóa học ---
app.post("/api/courses/:id/register", authenticateToken, (req, res) => {
    const courseId = parseInt(req.params.id);
    const userId = req.user.id;

    // kiểm tra khóa học có tồn tại không
    const course = courses.find(c => c.id === courseId);
    if (!course) {
        return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }

    // kiểm tra user đã đăng ký chưa
    const exists = userCourses.find(uc => uc.userId === userId && uc.courseId === courseId);
    if (exists) {
        return res.status(400).json({ message: "Bạn đã tham gia khóa học này rồi" });
    }

    // thêm userCourses mới
    userCourses.push({ userId, courseId, progress: 0 });

    res.json({ message: "Đăng ký khóa học thành công!" });
});

// --- API lấy chi tiết khóa học ---
app.get("/api/courses/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);

    if (!course) {
        return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }

    // tính tiến độ
    const total = course.lessons.length;
    const completed = course.lessons.filter(l => l.completed).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
        id: course.id,
        title: course.title,
        image: `http://localhost:${PORT}${course.image}`,
        description: course.description || "Khoá học hấp dẫn",
        price: course.price || "Miễn phí",
        instructor: course.instructor || "Giảng viên chưa rõ",
        duration: course.duration || "5 giờ",
        rating: course.rating || 4.5,
        progress, // thêm tiến độ
        lessons: course.lessons,
        reviews: course.reviews || []
    });
});


// ====== Database giả lập cho khóa học ======
let courses = [
    {
        id: 1,
        title: "React Cơ Bản",
        image: "/images/react-basic.jpg",
        category: "Công nghệ",
        level: "Cơ bản",
        price: 500,
        lessons: [
            { id: 1, title: "Giới thiệu", completed: true },
            { id: 2, title: "Component cơ bản", completed: false },
        ],
    },
    {
        id: 2,
        title: "Next.js Nâng Cao",
        image: "/images/next-advanced.jpg",
        category: "Công nghệ",
        level: "Nâng cao",
        price: 400,
        lessons: [
            { id: 1, title: "Routing", completed: true },
            { id: 2, title: "Data Fetching", completed: true },
            { id: 3, title: "Server Actions", completed: false },
        ],
    },
    {
        id: 3,
        title: "Giải tích 1",
        image: "/images/GT.jpg",
        category: "Toán học",
        level: "Nâng cao",
        price: 0,
        lessons: [
            { id: 1, title: "Hàm số", completed: true },
            { id: 2, title: "Chuỗi", completed: true },
            { id: 3, title: "Vô cùng bé, vô cùng lớn", completed: false },
        ],
    },
];

// Liên kết user ↔ khóa học (giả lập)
// progress tính theo % số bài học đã hoàn thành
let userCourses = [
    { userId: 1, courseId: 1, progress: 60 },
    { userId: 2, courseId: 2, progress: 20 },
];

// --- API lấy thông tin user hiện tại ---
app.get("/api/users/me", authenticateToken, (req, res) => {
    const user = users.find((u) => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json({ id: user.id, name: user.name, email: user.email });
});

// --- API lấy danh sách khóa học của user ---
app.get("/api/courses/my", authenticateToken, (req, res) => {
    const myCourses = userCourses
        .filter((uc) => uc.userId === req.user.id)
        .map((uc) => {
            const course = courses.find((c) => c.id === uc.courseId);
            return {
                id: course.id,
                title: course.title,
                image: `http://localhost:${PORT}${course.image}`, // trả về link ảnh đầy đủ
                progress: uc.progress,
            };
        });

    res.json(myCourses);
});

// --- API lấy bài học gần nhất chưa hoàn thành ---
app.get("/api/courses/:id/lesson/last", authenticateToken, (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find((c) => c.id === courseId);

    if (!course)
        return res.status(404).json({ message: "Không tìm thấy khóa học" });

    const nextLesson = course.lessons.find((lesson) => !lesson.completed);

    if (!nextLesson) {
        return res.json({ message: "Bạn đã hoàn thành khóa học này" });
    }

    res.json({
        courseId: course.id,
        lessonId: nextLesson.id,
        title: nextLesson.title,
    });
});
// --- API lấy tất cả khóa học ---
app.get("/api/courses", (req, res) => {
    const { keyword, category, level } = req.query;

    let result = [...courses];

    // Tìm kiếm theo từ khóa trong tiêu đề
    if (keyword) {
        result = result.filter(c =>
            c.title.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    // Lọc theo danh mục (nếu có)
    if (category) {
        result = result.filter(c => c.category === category);
    }

    // Lọc theo cấp độ (nếu có)
    if (level) {
        result = result.filter(c => c.level === level);
    }

    // Trả về danh sách khóa học (ẩn lessons chi tiết để nhẹ hơn)
    const formatted = result.map(c => ({
        id: c.id,
        title: c.title,
        image: `http://localhost:${PORT}${c.image}`,
        category: c.category || "Chưa phân loại",
        level: c.level || "Cơ bản"
    }));

    res.json(formatted);
});
// --- API lấy chi tiết khóa học ---
app.get("/api/courses/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const course = courses.find(c => c.id === id);

    if (!course) {
        return res.status(404).json({ message: "Không tìm thấy khóa học" });
    }

    res.json({
        id: course.id,
        title: course.title,
        image: `http://localhost:${PORT}${course.image}`,
        description: course.description || "Khoá học hấp dẫn",
        price: course.price || "Miễn phí",
        instructor: course.instructor || "Giảng viên chưa rõ",
        duration: course.duration || "5 giờ",
        rating: course.rating || 4.5,
        lessons: course.lessons,
        reviews: course.reviews || []
    });
});

app.listen(PORT, () => {
    console.log(`Backend chạy tại http://localhost:${PORT}`);
});
