'use client';

import { useEffect, useMemo, useState } from 'react';
import useAuthStore from '@/store/auth.store';
import CoursePicker from '@/components/provider/CoursePicker';
import { apiFetch } from '@/lib/api';

const defaultAnswers = () => [
  { answerContent: '', isCorrect: true },
  { answerContent: '', isCorrect: false },
  { answerContent: '', isCorrect: false },
  { answerContent: '', isCorrect: false },
];

export default function ProviderFinalQuizPage() {
  const user = useAuthStore((s) => s.user);

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const selectedCourse = useMemo(
    () => courses.find((c) => String(c.course_id) === String(selectedCourseId)) || null,
    [courses, selectedCourseId]
  );

  const [quiz, setQuiz] = useState(null);
  const [quizMsg, setQuizMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizSaved, setQuizSaved] = useState(false);

  const [quizConfig, setQuizConfig] = useState({
    testName: 'Quiz cuối khóa',
    testDuration: 15,
    testQNumber: 10,
  });

  const [qForm, setQForm] = useState({
    questionContent: '',
    answers: defaultAnswers(),
    correctIndex: 0,
  });

  const requireProvider = () => {
    if (!user) throw new Error('Bạn chưa đăng nhập');
    if (!(user.role === 'provider' || user.role === 'admin')) {
      throw new Error('Bạn không có quyền');
    }
  };

  const fetchMyCourses = async () => {
    requireProvider();
    const data = await apiFetch('/api/provider/courses');
    setCourses(Array.isArray(data?.courses) ? data.courses : []);
  };

  const loadFinalQuiz = async (courseId) => {
    requireProvider();
    setQuiz(null);
    setQuizMsg('');
    setQuizSaved(false);

    if (!courseId) return;

    setLoading(true);
    try {
      const data = await apiFetch(`/api/tests?course_id=${courseId}`);
      const tests = Array.isArray(data?.tests) ? data.tests : [];

      if (!tests.length) {
        setQuizMsg('Khóa học này chưa có quiz cuối khóa. Hãy bấm “Tạo quiz” rồi thêm câu hỏi.');
        setQuiz(null);
        return;
      }

      const picked = tests[0];
      const detail = await apiFetch(`/api/tests/${picked.test_id}`);
      setQuiz(detail?.test || detail);
    } catch (e) {
      setQuizMsg(e?.message || 'Lỗi tải quiz');
      setQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  const createFinalQuiz = async () => {
    requireProvider();
    if (!selectedCourseId) return;

    setLoading(true);
    setQuizMsg('');
    setQuizSaved(false);

    try {
      await apiFetch('/api/tests', {
        method: 'POST',
        body: {
          course_id: Number(selectedCourseId),
          testName: quizConfig.testName,
          testDuration: Number(quizConfig.testDuration),
          testQNumber: Number(quizConfig.testQNumber),
        },
      });

      await loadFinalQuiz(selectedCourseId);
      setQuizMsg('Đã tạo quiz. Bây giờ bạn hãy thêm câu hỏi bên dưới.');
    } catch (e) {
      setQuizMsg(e?.message || 'Lỗi tạo quiz');
    } finally {
      setLoading(false);
    }
  };

  const saveFinalQuiz = async () => {
    requireProvider();
    if (!quiz?.test_id) return;

    setLoading(true);
    setQuizMsg('');

    try {
      await apiFetch(`/api/tests/${quiz.test_id}`, {
        method: 'PUT',
        body: {
          course_id: Number(selectedCourseId),
          testName: quiz.testName,
          testDuration: Number(quiz.testDuration),
          testQNumber: Number(quiz.testQNumber),
        },
      });

      await loadFinalQuiz(selectedCourseId);
      setQuizSaved(true);
      setQuizMsg('✅ Đã lưu quiz thành công.');
    } catch (e) {
      setQuizSaved(false);
      setQuizMsg(e?.message || 'Lỗi lưu quiz');
    } finally {
      setLoading(false);
    }
  };

  const setCorrect = (idx) => {
    setQForm((p) => ({
      ...p,
      correctIndex: idx,
      answers: p.answers.map((a, i) => ({ ...a, isCorrect: i === idx })),
    }));
  };

  const updateAnswer = (idx, value) => {
    setQForm((p) => ({
      ...p,
      answers: p.answers.map((a, i) => (i === idx ? { ...a, answerContent: value } : a)),
    }));
  };

  const addQuestionToFinalQuiz = async () => {
    requireProvider();
    if (!quiz?.test_id) return;

    const currentCount = Array.isArray(quiz?.questions) ? quiz.questions.length : 0;
    const targetCount = quiz?.testQNumber ?? quizConfig.testQNumber;

    if (currentCount >= targetCount) {
      return setQuizMsg('Quiz đã đủ số câu hỏi. Hãy bấm “Lưu quiz”.');
    }

    const content = String(qForm.questionContent || '').trim();
    const answers = (qForm.answers || [])
      .map((a) => ({
        answerContent: String(a.answerContent || '').trim(),
        isCorrect: !!a.isCorrect,
      }))
      .filter((a) => a.answerContent);

    if (!content) return setQuizMsg('⚠️ Bạn chưa nhập nội dung câu hỏi.');
    if (answers.length < 2) return setQuizMsg('⚠️ Cần ít nhất 2 đáp án có nội dung.');
    if (!answers.some((a) => a.isCorrect)) return setQuizMsg('⚠️ Bạn chưa chọn đáp án đúng.');

    setLoading(true);
    setQuizMsg('');
    setQuizSaved(false);

    try {
      const createdQ = await apiFetch('/api/questions', {
        method: 'POST',
        body: {
          questionContent: content,
          type_id: 1,
          level: 1,
          answers,
          majorIds: null,
        },
      });

      const qid = createdQ?.question?.question_id || createdQ?.question_id;
      if (!qid) throw new Error('Tạo question ok nhưng không lấy được question_id');

      await apiFetch(`/api/tests/${quiz.test_id}/questions`, {
        method: 'POST',
        body: {
          question_id: Number(qid),
          orderIndex: null,
        },
      });

      setQForm({
        questionContent: '',
        answers: defaultAnswers(),
        correctIndex: 0,
      });

      await loadFinalQuiz(selectedCourseId);
      setQuizMsg('✅ Đã thêm câu hỏi vào quiz.');
    } catch (e) {
      setQuizMsg(e?.message || 'Lỗi thêm câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchMyCourses().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  useEffect(() => {
    if (!selectedCourseId) return;
    loadFinalQuiz(selectedCourseId).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseId]);

  const currentCount = Array.isArray(quiz?.questions) ? quiz.questions.length : 0;
  const targetCount = quiz?.testQNumber ?? quizConfig.testQNumber;
  const isEnoughQuestions = currentCount >= targetCount;

  return (
    <div className="min-h-screen bg-white">
      <main className="bg-white w-full pt-[45px]">
        <section className="z-0 hero bg-gradient-to-br from-indigo-500 to-white/10 p-4 flex flex-col md:flex-row items-center md:justify-between gap-4 relative text-center after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
          <div className="text-left">
            <div className="text-white/90 text-sm font-semibold">Provider • Final Quiz</div>
            <div className="text-white text-xl md:text-2xl font-extrabold">Tạo Quiz bằng cách thêm câu hỏi</div>
            <div className="text-white/80 text-sm mt-1">
              Đăng nhập: <b>{user?.username}</b> ({user?.role})
            </div>
          </div>
        </section>

        <section className="px-6 py-6">
          <div className="max-w-6xl mx-auto">
            <CoursePicker
              courses={courses}
              selectedCourseId={selectedCourseId}
              onChange={setSelectedCourseId}
              onReload={() => fetchMyCourses()}
            />

            <div className="mb-4 text-sm text-gray-600">
              Khóa học đang chọn: <b>{selectedCourse?.courseName || '—'}</b>
            </div>

            {quizMsg && (
              <div className="mb-4 p-3 rounded-xl bg-yellow-50 text-yellow-800 border border-yellow-200">
                {quizMsg}
              </div>
            )}

            {!selectedCourseId ? (
              <div className="p-4 text-gray-600">Hãy chọn khóa học để thao tác.</div>
            ) : loading ? (
              <div className="p-4 text-gray-600">Đang tải...</div>
            ) : !quiz ? (
              <div className="border border-gray-200 rounded-2xl p-4 bg-white">
                <div className="font-bold text-gray-900 mb-1">Bước 1: Tạo quiz cho khóa học này</div>
                <div className="text-sm text-gray-600 mb-3">
                  Sau khi tạo xong, bạn sẽ thêm câu hỏi + đáp án và chọn đáp án đúng.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    value={quizConfig.testName}
                    onChange={(e) => setQuizConfig((p) => ({ ...p, testName: e.target.value }))}
                    className="border border-gray-300 rounded-xl px-3 py-2 text-sm"
                    placeholder="Tên quiz"
                  />
                  <input
                    value={quizConfig.testDuration}
                    onChange={(e) => setQuizConfig((p) => ({ ...p, testDuration: e.target.value }))}
                    className="border border-gray-300 rounded-xl px-3 py-2 text-sm"
                    placeholder="Thời gian (phút)"
                  />
                  <input
                    value={quizConfig.testQNumber}
                    onChange={(e) => setQuizConfig((p) => ({ ...p, testQNumber: e.target.value }))}
                    className="border border-gray-300 rounded-xl px-3 py-2 text-sm"
                    placeholder="Số câu mục tiêu"
                  />
                </div>

                <button
                  onClick={createFinalQuiz}
                  className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Tạo quiz
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
                <div className="border border-gray-200 rounded-2xl p-4 bg-white">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-gray-900">
                        {quiz.testName} (Test ID: {quiz.test_id})
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Tiến độ câu hỏi: <b>{currentCount}</b> / <b>{targetCount}</b> • Thời gian: <b>{quiz.testDuration}</b> phút
                      </div>
                    </div>

                    <button
                      onClick={() => loadFinalQuiz(selectedCourseId)}
                      className="px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold"
                    >
                      Reload
                    </button>
                  </div>

                  <div className="mt-4">
                    {Array.isArray(quiz?.questions) && quiz.questions.length > 0 ? (
                      <div className="space-y-3">
                        {quiz.questions.map((q, idx) => (
                          <div key={q.question_id} className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                            <div className="font-semibold text-gray-900">
                              {idx + 1}. {q.questionContent}
                            </div>
                            <div className="mt-2 text-sm text-gray-700 space-y-1">
                              {(q.Answers || []).map((a) => (
                                <div key={a.answer_id}>
                                  • {a.answerContent} {a.isCorrect ? <b className="text-green-700">(đúng)</b> : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-600">Quiz đã tạo nhưng chưa có câu hỏi. Hãy thêm bên phải.</div>
                    )}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-2xl p-4 bg-white">
                  {!isEnoughQuestions ? (
                    <>
                      <div className="font-bold text-gray-900 mb-1">Bước 2: Thêm câu hỏi</div>
                      <div className="text-sm text-gray-600 mb-3">
                        Nhập câu hỏi, nhập đáp án, chọn đáp án đúng rồi bấm <b>“Thêm câu hỏi”</b>.
                      </div>

                      <textarea
                        value={qForm.questionContent}
                        onChange={(e) => setQForm((p) => ({ ...p, questionContent: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm min-h-[90px]"
                        placeholder="Ví dụ: NodeJS dùng runtime nào?"
                      />

                      <div className="mt-3 text-sm font-semibold text-gray-700">Đáp án (chọn đáp án đúng)</div>

                      <div className="mt-2 space-y-2">
                        {['A', 'B', 'C', 'D'].map((label, idx) => (
                          <div key={label} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={qForm.correctIndex === idx}
                              onChange={() => setCorrect(idx)}
                            />
                            <div className="w-6 text-sm font-bold text-gray-700">{label}.</div>
                            <input
                              value={qForm.answers[idx]?.answerContent || ''}
                              onChange={(e) => updateAnswer(idx, e.target.value)}
                              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm"
                              placeholder={`Nhập đáp án ${label}`}
                            />
                          </div>
                        ))}
                      </div>

                      <button
                        disabled={loading}
                        onClick={addQuestionToFinalQuiz}
                        className={`mt-4 w-full py-2 rounded-xl font-semibold shadow ${
                          loading ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        Thêm câu hỏi
                      </button>

                      <div className="text-xs text-gray-500 mt-3">
                        * Hệ thống sẽ tự tạo question + answers và gắn vào quiz của khóa học đang chọn.
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-gray-900 mb-1">Bước 2: Lưu quiz</div>
                      <div className="text-sm text-gray-600 mb-3">
                        Quiz đã đủ <b>{targetCount}</b> câu hỏi. Bạn có thể lưu lại quiz để hoàn tất.
                      </div>

                      <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                        <div>
                          Trạng thái: <b>Đã đủ số câu hỏi yêu cầu</b>
                        </div>
                        <div className="mt-1">
                          Số câu hiện tại: <b>{currentCount}</b> / <b>{targetCount}</b>
                        </div>
                      </div>

                      <button
                        disabled={loading || quizSaved}
                        onClick={saveFinalQuiz}
                        className={`mt-4 w-full py-2 rounded-xl font-semibold shadow ${
                          loading || quizSaved
                            ? 'bg-gray-300 text-white cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {quizSaved ? 'Đã lưu quiz' : 'Lưu quiz'}
                      </button>

                      <div className="text-xs text-gray-500 mt-3">
                        * Sau khi lưu, quiz sẽ giữ nguyên danh sách câu hỏi hiện tại.
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}