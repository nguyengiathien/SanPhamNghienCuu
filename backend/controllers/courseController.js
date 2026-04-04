'use strict';

const db = require('../models');

const isAdmin = (req) => req.user?.role === 'admin';

exports.getAllCourses = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.max(parseInt(req.query.limit || '8', 10), 1);
    const offset = (page - 1) * limit;

    const { majorId, level, search } = req.query;

    const where = {};
    if (level) where.level = level;

    // search theo courseName
    if (search) {
      where.courseName = { [db.Sequelize.Op.like]: `%${search}%` };
    }

    // include majors (category)
    const include = [
      {
        model: db.Major,
        as: 'majors',
        through: { attributes: [] },
        required: !!majorId,
        ...(majorId ? { where: { major_id: majorId } } : {}),
      },
      {
        model: db.User,
        as: 'creator',
        attributes: ['user_id', 'username', 'fullName'],
      },
    ];
    console.log("Course associations:", Object.keys(db.Course.associations));
    const { rows, count } = await db.Course.findAndCountAll({
      where,
      include,
      distinct: true, // rất quan trọng khi join many-to-many
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const totalItems = count;
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      courses: rows,
      pagination: { page, limit, totalItems, totalPages },
    });
  } catch (err) {
    next(err);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const course = await db.Course.findByPk(req.params.id, {
      include: [
        { model: db.User, as: 'creator', attributes: ['user_id', 'username', 'fullName', 'role'] },

        // ✅ FIX alias majors
        {
          model: db.Major,
          as: 'majors',
          attributes: ['major_id', 'majorName'],
          through: { attributes: [] },
        },

        { model: db.Outcome },

        {
          model: db.Lesson,
          include: [db.LessonContent],
        },
      ],
    });

    if (!course) return res.status(404).json({ message: 'khong tim thay khoa hoc' });
    res.json({ course });
  } catch (err) {
    next(err);
  }
};


exports.createCourse = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const creator_id = req.user?.user_id || req.body.creator_id;
    const { courseName, courseDescription, majorIds } = req.body;

    const course = await db.Course.create({
      courseName,
      courseDescription: courseDescription || null,
      creator_id,
      ratingAvg: 0.0,
      ratingNum: 0
    }, { transaction: t });

    if (Array.isArray(majorIds) && majorIds.length > 0) {
      const rows = majorIds.map((mid) => ({ course_id: course.course_id, major_id: mid }));
      await db.CourseMajor.bulkCreate(rows, { transaction: t });
    }

    await t.commit();

    const full = await db.Course.findByPk(course.course_id, {
      include: [
        {
          model: db.Major,
          as: 'majors',
          attributes: ['major_id', 'majorName'],
          through: { attributes: [] },
        },
        db.Outcome,
      ],
    });

    return res.status(201).json({ message: 'tao khoa hoc thanh cong', course: full });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.updateCourse = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const course = await db.Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'khong tim thay khoa hoc' });

    if (!isAdmin(req) && req.user?.user_id && course.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen cap nhat khoa hoc nay' });
    }

    const { courseName, courseDescription, ratingAvg, ratingNum, majorIds } = req.body;

    await course.update({
      courseName: courseName ?? course.courseName,
      courseDescription: courseDescription ?? course.courseDescription,
      ratingAvg: ratingAvg ?? course.ratingAvg,
      ratingNum: ratingNum ?? course.ratingNum
    }, { transaction: t });

    if (Array.isArray(majorIds)) {
      await db.CourseMajor.destroy({ where: { course_id: course.course_id }, transaction: t });
      if (majorIds.length > 0) {
        await db.CourseMajor.bulkCreate(
          majorIds.map((mid) => ({ course_id: course.course_id, major_id: mid })),
          { transaction: t }
        );
      }
    }

    await t.commit();

    const full = await db.Course.findByPk(course.course_id, {
      include: [
        {
          model: db.Major,
          as: 'majors',
          attributes: ['major_id', 'majorName'],
          through: { attributes: [] },
        },
        db.Outcome,
      ],
    });

    res.json({ message: 'cap nhat thanh cong', course: full });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await db.Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'khong tim thay khoa hoc' });

    if (!isAdmin(req) && req.user?.user_id && course.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen xoa khoa hoc nay' });
    }

    await course.destroy();
    res.json({ message: 'xoa thanh cong' });
  } catch (err) {
    next(err);
  }
};

// Outcomes
exports.getOutcomesByCourse = async (req, res, next) => {
  try {
    const outcomes = await db.Outcome.findAll({ where: { course_id: req.params.courseId } });
    res.json({ outcomes });
  } catch (err) {
    next(err);
  }
};

exports.createOutcome = async (req, res, next) => {
  try {
    const course = await db.Course.findByPk(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'khong tim thay khoa hoc' });

    if (!isAdmin(req) && req.user?.user_id && course.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen them outcome' });
    }

    const outcome = await db.Outcome.create({
      outcomeContent: req.body.outcomeContent,
      course_id: course.course_id
    });

    res.status(201).json({ message: 'tao outcome thanh cong', outcome });
  } catch (err) {
    next(err);
  }
};

exports.updateOutcome = async (req, res, next) => {
  try {
    const outcome = await db.Outcome.findByPk(req.params.outcomeId);
    if (!outcome) return res.status(404).json({ message: 'khong tim thay outcome' });

    const course = await db.Course.findByPk(outcome.course_id);
    if (course && !isAdmin(req) && req.user?.user_id && course.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen cap nhat outcome' });
    }

    await outcome.update({ outcomeContent: req.body.outcomeContent });
    res.json({ message: 'cap nhat thanh cong', outcome });
  } catch (err) {
    next(err);
  }
};

exports.deleteOutcome = async (req, res, next) => {
  try {
    const outcome = await db.Outcome.findByPk(req.params.outcomeId);
    if (!outcome) return res.status(404).json({ message: 'khong tim thay outcome' });

    const course = await db.Course.findByPk(outcome.course_id);
    if (course && !isAdmin(req) && req.user?.user_id && course.creator_id !== req.user.user_id) {
      return res.status(403).json({ message: 'khong co quyen xoa outcome' });
    }

    await outcome.destroy();
    res.json({ message: 'xoa thanh cong' });
  } catch (err) {
    next(err);
  }
};

exports.updateCourseThumbnail = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const course = await db.Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Không tìm thấy khóa học" });

    if (!req.file) {
      return res.status(400).json({ message: "Chưa chọn ảnh thumbnail" });
    }

    // url public
    const publicUrl = `/uploads/coursesThumbnail/${req.file.filename}`;

    await course.update({ thumbnailUrl: publicUrl });

    res.json({
      message: "Cập nhật thumbnail thành công",
      course,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/:courseId/lessons
exports.getLessonsOfCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.user_id;

    // 1) lấy lessons theo course
    const lessons = await db.Lesson.findAll({
      where: { course_id: courseId },
      attributes: ['lesson_id', 'lessonName', 'orderIndex', 'course_id'],
      order: [['orderIndex', 'ASC']],
    });

    // 2) lấy progress của user cho các lesson đó
    // NOTE: đổi db.LearningProcess nếu model của bạn tên khác
    const progresses = await db.LearningProcess.findAll({
      where: { user_id: userId },
      attributes: ['lesson_id', 'status'],
    });

    const progressMap = new Map(progresses.map((p) => [p.lesson_id, p.status]));

    const result = lessons.map((l) => {
      const st = progressMap.get(l.lesson_id);
      return {
        ...l.toJSON(),
        completed: st === true || st === 1 || st === '1',
      };
    });

    res.json({ lessons: result });
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/:courseId/lessons/:lessonId
exports.getLessonOfCourse = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const userId = req.user?.user_id;

    // 1) lấy lesson theo PK nhưng bắt buộc đúng course_id
    const lesson = await db.Lesson.findOne({
      where: { lesson_id: lessonId, course_id: courseId },
      include: [db.LessonContent],
      order: [[db.LessonContent, 'orderIndex', 'ASC']],
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy bài học trong khóa học này' });
    }

    // 2) lấy progress status
    const progress = await db.LearningProcess.findOne({
      where: { user_id: userId, lesson_id: lessonId },
      attributes: ['status'],
    });

    const payload = lesson.toJSON();
    const st = progress?.status;
    payload.completed = st === true || st === 1 || st === '1';

    res.json({ lesson: payload });
  } catch (err) {
    next(err);
  }
};

// GET /api/courses/:id/progress
// trả về tiến độ của user trong 1 khóa học (bao nhiêu bài hoàn thành / tổng bài)
exports.getMyCourseProgress = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user?.user_id;

    // lấy tất cả lessons của course
    const lessons = await db.Lesson.findAll({
      where: { course_id: courseId },
      attributes: ['lesson_id'],
    });

    const lessonIds = lessons.map((l) => l.lesson_id);

    if (lessonIds.length === 0) {
      return res.json({
        courseId: Number(courseId),
        totalLessons: 0,
        completedLessons: 0,
        percent: 0,
      });
    }

    // lấy learning process của user cho các lessons đó
    const doneCount = await db.LearningProcess.count({
      where: {
        user_id: userId,
        lesson_id: lessonIds,
        status: 1,
      },
    });

    const total = lessonIds.length;
    const percent = Math.round((doneCount / total) * 100);

    res.json({
      courseId: Number(courseId),
      totalLessons: total,
      completedLessons: doneCount,
      percent,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCourseRatingSummary = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const course = await db.Course.findByPk(courseId, {
      attributes: ['course_id', 'ratingAvg', 'ratingNum'],
    });
    if (!course) return res.status(404).json({ message: 'khong tim thay khoa hoc' });

    res.json({
      ratingAvg: Number(course.ratingAvg || 0),
      ratingNum: Number(course.ratingNum || 0),
    });
  } catch (err) {
    next(err);
  }
};

exports.rateCourse = async (req, res, next) => {
  const t = await db.sequelize.transaction();
  try {
    const courseId = req.params.id;
    const userId = req.user.user_id;
    const { stars, comment } = req.body;

    const s = parseInt(stars, 10);
    if (![1, 2, 3, 4, 5].includes(s)) {
      return res.status(400).json({ message: 'stars phai tu 1 den 5' });
    }

    const course = await db.Course.findByPk(courseId, { transaction: t });
    if (!course) return res.status(404).json({ message: 'khong tim thay khoa hoc' });

    await db.CourseRating.upsert(
      {
        course_id: courseId,
        user_id: userId,
        stars: s,
        comment: comment || null,
      },
      { transaction: t }
    );

    const rows = await db.CourseRating.findAll({
      where: { course_id: courseId },
      attributes: ['stars'],
      transaction: t,
    });

    const ratingNum = rows.length;
    const ratingAvg = ratingNum
      ? rows.reduce((sum, r) => sum + Number(r.stars), 0) / ratingNum
      : 0;

    const finalAvg = Number(ratingAvg.toFixed(1));

    await course.update(
      {
        ratingNum,
        ratingAvg: finalAvg,
      },
      { transaction: t }
    );

    await t.commit();

    res.json({
      message: 'danh gia thanh cong',
      myRating: {
        course_id: Number(courseId),
        user_id: Number(userId),
        stars: s,
        comment: comment || null,
      },
      ratingAvg: finalAvg,
      ratingNum,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};


exports.getFinalQuizOfCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    // 1) verify course tồn tại
    const course = await db.Course.findByPk(courseId, {
      attributes: ['course_id', 'courseName'],
    });
    if (!course) return res.status(404).json({ message: 'Không tìm thấy khóa học' });

    // 2) lấy quiz cuối khóa (Test) theo course_id
    // Nếu bạn có cột type/isFinal thì thêm điều kiện vào where
    const test = await db.Test.findOne({
      where: { course_id: courseId },
      order: [['createdAt', 'DESC']],
      // ====== CASE A: Test belongsToMany Question through TestQuestion ======
      include: [
        {
          model: db.Question,
          // nếu association của bạn có alias, ví dụ as:'questions'
          // thì bật dòng dưới:
          // as: 'questions',

          through: { attributes: [] },
          required: false,
          // CHỈ lấy field cần dùng
          attributes: [
            'question_id',
            'questionContent', // hoặc 'content' tùy bạn
            'optionA',
            'optionB',
            'optionC',
            'optionD',
            'correctKey',      // bạn nên có cột này: 'A'|'B'|'C'|'D'
            'orderIndex',
          ],
        },
      ],
    });

    if (!test) {
      return res.status(404).json({ message: 'Khóa học này chưa có quiz cuối khóa' });
    }

    // 3) format response cho FE
    const rawQuestions = Array.isArray(test.Questions) ? test.Questions : (Array.isArray(test.questions) ? test.questions : []);
    const questions = rawQuestions
      .slice()
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
      .map((q) => {
        const content = q.questionContent || q.content || q.question || '';
        const options = [];
        if (q.optionA) options.push({ key: 'A', label: q.optionA });
        if (q.optionB) options.push({ key: 'B', label: q.optionB });
        if (q.optionC) options.push({ key: 'C', label: q.optionC });
        if (q.optionD) options.push({ key: 'D', label: q.optionD });

        return {
          question_id: q.question_id,
          content,
          options,
          orderIndex: q.orderIndex ?? null,
        };
      });

    return res.json({
      quiz: {
        test_id: test.test_id,
        title: test.title || 'Quiz cuối khóa',
        course_id: test.course_id,
      },
      questions,
    });
  } catch (err) {
    next(err);
  }
};

// ========================================
// POST /api/courses/:courseId/quiz/submit
// body: { answers: [{question_id, selectedKey}] }
// ========================================
exports.submitFinalQuizOfCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.user_id;

    if (!userId) return res.status(401).json({ message: 'Chưa đăng nhập' });

    const answersArr = Array.isArray(req.body?.answers) ? req.body.answers : [];
    if (!answersArr.length) {
      return res.status(400).json({ message: 'Thiếu answers' });
    }

    // 1) lấy test theo course
    const test = await db.Test.findOne({
      where: { course_id: courseId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: db.Question,
          // nếu có alias thì thêm as:'questions'
          // as: 'questions',
          through: { attributes: [] },
          required: false,
          attributes: [
            'question_id',
            'correctKey', // 'A'|'B'|'C'|'D'
            'orderIndex',
          ],
        },
      ],
    });

    if (!test) {
      return res.status(404).json({ message: 'Khóa học này chưa có quiz cuối khóa' });
    }

    const questions = Array.isArray(test.Questions) ? test.Questions : (Array.isArray(test.questions) ? test.questions : []);
    if (!questions.length) {
      return res.status(400).json({ message: 'Quiz chưa có câu hỏi' });
    }

    // 2) map answers user
    const userAnswerMap = new Map(
      answersArr.map((x) => [Number(x.question_id), String(x.selectedKey || '').toUpperCase()])
    );

    // 3) chấm điểm
    let correctCount = 0;
    const details = questions
      .slice()
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
      .map((q) => {
        const qid = Number(q.question_id);
        const correctKey = String(q.correctKey || '').toUpperCase();
        const userKey = userAnswerMap.get(qid) || null;
        const isCorrect = !!userKey && !!correctKey && userKey === correctKey;

        if (isCorrect) correctCount += 1;

        return {
          question_id: qid,
          correctKey,
          userKey,
          isCorrect,
        };
      });

    const total = questions.length;
    const score = correctCount; // bạn có thể đổi ra thang 10 nếu muốn

    // 4) (Tuỳ chọn) lưu attempt/result vào DB
    // Nếu bạn có model Attempt / Response thì bạn lưu ở đây.
    // Mình trả kết quả cho FE trước đã:
    return res.json({
      score,
      total,
      correctCount,
      details,
    });
  } catch (err) {
    next(err);
  }}

  exports.getMyCourseRating = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user?.user_id;

    const rating = await db.CourseRating.findOne({
      where: {
        course_id: courseId,
        user_id: userId,
      },
      attributes: ['course_id', 'user_id', 'stars', 'comment', 'createdAt', 'updatedAt'],
    });

    res.json({
      rating: rating || null,
    });
  } catch (err) {
    next(err);
  }
};

exports.getCourseAdminOverview = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const course = await db.Course.findByPk(courseId, {
      attributes: [
        'course_id',
        'courseName',
        'courseDescription',
        'thumbnailUrl',
        'level',
        'creator_id',
        'ratingAvg',
        'ratingNum',
        'createdAt',
      ],
      include: [
        {
          model: db.User,
          as: 'creator',
          attributes: ['user_id', 'username', 'fullName', 'email', 'role'],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: 'khong tim thay khoa hoc' });
    }

    // Đếm số học viên đã bắt đầu học khóa học:
    // có ít nhất 1 bản ghi LearningProcess ở bất kỳ lesson nào của course
    const lessons = await db.Lesson.findAll({
      where: { course_id: courseId },
      attributes: ['lesson_id'],
      raw: true,
    });

    const lessonIds = lessons.map((x) => x.lesson_id);

    let learnersCount = 0;
    if (lessonIds.length > 0) {
      const learnerRows = await db.LearningProcess.findAll({
        where: { lesson_id: lessonIds },
        attributes: ['user_id'],
        group: ['user_id'],
        raw: true,
      });

      learnersCount = learnerRows.length;
    }

    const ratings = await db.CourseRating.findAll({
      where: { course_id: courseId },
      attributes: ['course_id', 'user_id', 'stars', 'comment', 'createdAt', 'updatedAt'],
      include: [
        {
          model: db.User,
          attributes: ['user_id', 'username', 'fullName', 'email'],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    res.json({
      course,
      stats: {
        learnersCount,
        ratingAvg: Number(course.ratingAvg || 0),
        ratingNum: Number(course.ratingNum || 0),
        totalLessons: lessonIds.length,
      },
      ratings,
    });
  } catch (err) {
    next(err);
  }
};