'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import useAuthStore from '@/store/auth.store';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

function absUrl(url) {
  if (!url) return '';
  if (url.startsWith('/')) return `${API_BASE}${url}`;
  return url;
}

function levelLabel(level) {
  if (level === 'beginner') return 'Cơ bản';
  if (level === 'intermediate') return 'Trung cấp';
  if (level === 'advanced') return 'Nâng cao';
  return level || '—';
}

function StarRow({ value = 0 }) {
  const full = Math.max(0, Math.min(5, Math.round(Number(value || 0))));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-xl ${i < full ? 'text-yellow-500' : 'text-gray-300'}`}>
          ★
        </span>
      ))}
    </div>
  );
}

function extractQuestions(test) {
  const qs = Array.isArray(test?.questions) ? test.questions : [];

  return qs
    .map((q) => ({
      question_id: q.question_id,
      questionContent: q.questionContent,
      orderIndex: q?.TestQuestion?.orderIndex ?? q.orderIndex ?? 0,
      answers: Array.isArray(q?.Answers) ? q.Answers : [],
    }))
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
}

function CertificateCard({ userName, courseName }) {
  const today = new Date().toLocaleDateString('vi-VN');

  return (
    <div className="relative overflow-hidden rounded-[28px] border-[10px] border-yellow-200 bg-gradient-to-br from-yellow-50 via-white to-amber-50 shadow-xl">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-4 w-24 h-24 rounded-full border border-yellow-200 opacity-40" />
        <div className="absolute bottom-6 right-6 w-32 h-32 rounded-full border border-yellow-200 opacity-30" />
      </div>

      <div className="relative px-8 py-10 md:px-14 md:py-14 text-center">
        <div className="text-yellow-700 tracking-[0.35em] text-xs md:text-sm font-bold uppercase">
          Certificate of Completion
        </div>

        <div className="mt-4 text-3xl md:text-5xl font-extrabold text-amber-900 leading-tight font-serif">
          Chứng nhận hoàn thành
        </div>

        <div className="mt-4 text-gray-600 text-sm md:text-base">
          Trân trọng trao tặng chứng chỉ này cho
        </div>

        <div className="mt-5 text-2xl md:text-4xl font-bold text-indigo-800 border-b-2 border-dashed border-yellow-300 inline-block px-6 pb-2">
          {userName || 'Học viên xuất sắc'}
        </div>

        <div className="mt-6 text-gray-700 text-base md:text-lg leading-8 max-w-3xl mx-auto">
          Chúc mừng bạn đã hoàn thành xuất sắc khóa học
        </div>

        <div className="mt-3 text-xl md:text-3xl font-extrabold text-green-700">
          “{courseName || 'Khóa học'}”
        </div>

        <div className="mt-5 text-gray-700 text-base md:text-lg max-w-3xl mx-auto leading-8">
          với kết quả <span className="font-bold text-red-600">100% số câu trả lời chính xác</span>.
          Đây là minh chứng cho sự nỗ lực, tinh thần học tập nghiêm túc và sự kiên trì của bạn.
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="text-center md:text-left">
            <div className="text-sm text-gray-500">Ngày cấp</div>
            <div className="mt-2 text-lg font-semibold text-gray-800">{today}</div>
          </div>

          <div className="text-center md:text-right">
            <div className="text-sm text-gray-500">Đơn vị cấp chứng nhận</div>
            <div className="mt-2 text-lg font-bold text-indigo-700">E-Learning System</div>
            <div className="mt-6 inline-block">
              <div className="text-3xl text-indigo-700 font-serif">E-Learning System</div>
              <div className="mt-2 border-t border-gray-400 pt-2 text-sm text-gray-600">
                Đại diện hệ thống đào tạo
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs md:text-sm text-gray-500 italic">
          “Chúc mừng bạn {userName || 'học viên'} đã hoàn thành khóa học {courseName || 'này'}”
        </div>
      </div>
    </div>
  );
}

export default function CourseQuizPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id;

  const user = useAuthStore((s) => s.user);
  const storeToken = useAuthStore((s) => s.token);
  const token = storeToken || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  const [course, setCourse] = useState(null);

  const [testId, setTestId] = useState(null);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [answers, setAnswers] = useState({});
  const [details, setDetails] = useState({});

  const [attemptId, setAttemptId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const canUse = !!token;

  const unansweredCount = useMemo(() => {
    if (!questions.length) return 0;
    return questions.reduce((acc, q) => acc + (answers[q.question_id] ? 0 : 1), 0);
  }, [questions, answers]);

  useEffect(() => {
    if (!courseId) return;

    if (!token) {
      router.push('/login');
      return;
    }

    (async () => {
      setLoading(true);
      setErrMsg('');
      setResult(null);
      setDetails({});
      setAnswers({});
      setAttemptId(null);
      setTest(null);
      setQuestions([]);
      setTestId(null);

      try {
        const cRes = await fetch(`${API_BASE}/api/courses/${courseId}`);
        const cData = await cRes.json().catch(() => ({}));
        if (!cRes.ok) throw new Error(cData?.message || 'Không tải được khóa học');
        setCourse(cData?.course || cData);

        const tRes = await fetch(`${API_BASE}/api/tests?course_id=${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tData = await tRes.json().catch(() => ({}));
        if (!tRes.ok) throw new Error(tData?.message || 'Không tải được danh sách đề thi');

        const tests = Array.isArray(tData?.tests) ? tData.tests : [];
        if (!tests.length) throw new Error('Khóa học này chưa có quiz cuối khóa');

        const picked = tests[0];
        const pickedId = picked.test_id;
        setTestId(pickedId);

        const tdRes = await fetch(`${API_BASE}/api/tests/${pickedId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tdData = await tdRes.json().catch(() => ({}));
        if (!tdRes.ok) throw new Error(tdData?.message || 'Không tải được đề thi');

        const testObj = tdData?.test;
        setTest(testObj);

        const qs = extractQuestions(testObj);
        setQuestions(qs);

        if (!qs.length) throw new Error('Quiz này chưa có câu hỏi');

        const aRes = await fetch(`${API_BASE}/api/tests/${pickedId}/attempts`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const aData = await aRes.json().catch(() => ({}));
        if (!aRes.ok) throw new Error(aData?.message || 'Không thể bắt đầu lượt làm bài');

        setAttemptId(aData?.attempt?.attempt_id || null);
      } catch (e) {
        setErrMsg(e?.message || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId, token, router]);

  const handleSelect = (questionId, answerId) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    if (!token) return router.push('/login');
    if (!questions.length) return;
    if (!attemptId) return alert('Thiếu attemptId, vui lòng tải lại trang.');

    if (unansweredCount > 0) {
      alert(`Bạn còn ${unansweredCount} câu chưa trả lời.`);
      return;
    }

    try {
      setSubmitting(true);

      const entries = Object.entries(answers);

      const responses = await Promise.all(
        entries.map(async ([question_id, answer_id]) => {
          const res = await fetch(`${API_BASE}/api/tests/attempts/${attemptId}/responses`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              question_id: Number(question_id),
              answer_id: Number(answer_id),
            }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.message || `Lỗi lưu câu ${question_id}`);
          return data?.response;
        })
      );

      const d = {};
      for (const r of responses) {
        if (!r) continue;
        d[r.question_id] = { isCorrect: r.isCorrect === true, answer_id: r.answer_id };
      }
      setDetails(d);

      const fRes = await fetch(`${API_BASE}/api/tests/attempts/${attemptId}/finish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const fData = await fRes.json().catch(() => ({}));
      if (!fRes.ok) throw new Error(fData?.message || 'Nộp bài thất bại');

      setResult(fData?.result || null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      alert(e?.message || 'Có lỗi khi nộp bài');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = async () => {
    if (!token || !testId) return;

    setResult(null);
    setDetails({});
    setAnswers({});
    setAttemptId(null);

    try {
      const aRes = await fetch(`${API_BASE}/api/tests/${testId}/attempts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const aData = await aRes.json().catch(() => ({}));
      if (!aRes.ok) throw new Error(aData?.message || 'Không thể bắt đầu lượt làm bài');
      setAttemptId(aData?.attempt?.attempt_id || null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      alert(e?.message || 'Lỗi làm lại');
    }
  };

  const handlePrintCertificate = () => {
    const learnerName = user?.fullName || user?.username || 'Học viên';
    const courseName = course?.courseName || 'Khóa học';
    const today = new Date().toLocaleDateString('vi-VN');

    const html = `
      <html>
        <head>
          <title>Chứng chỉ hoàn thành khóa học</title>
          <meta charset="utf-8" />
          <style>
            body {
              margin: 0;
              padding: 24px;
              background: #f8fafc;
              font-family: "Times New Roman", serif;
            }
            .certificate {
              max-width: 1100px;
              margin: 0 auto;
              background: linear-gradient(135deg, #fffdf4, #ffffff, #fff8e6);
              border: 12px solid #e8c76a;
              border-radius: 28px;
              padding: 56px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            }
            .top {
              text-align: center;
              color: #9a6700;
              font-size: 14px;
              font-weight: bold;
              letter-spacing: 4px;
              text-transform: uppercase;
            }
            h1 {
              text-align: center;
              margin: 20px 0 10px;
              font-size: 46px;
              color: #5b3a00;
            }
            .sub {
              text-align: center;
              font-size: 20px;
              color: #4b5563;
              margin-top: 8px;
            }
            .name {
              margin: 30px auto 0;
              text-align: center;
              font-size: 42px;
              color: #1e40af;
              font-weight: bold;
              border-bottom: 2px dashed #d6b656;
              display: table;
              padding: 0 28px 10px;
            }
            .course {
              margin-top: 22px;
              text-align: center;
              font-size: 34px;
              color: #15803d;
              font-weight: bold;
            }
            .desc {
              margin: 24px auto 0;
              max-width: 820px;
              text-align: center;
              font-size: 21px;
              line-height: 1.8;
              color: #374151;
            }
            .footer {
              margin-top: 70px;
              display: flex;
              justify-content: space-between;
              align-items: end;
            }
            .label {
              color: #6b7280;
              font-size: 14px;
            }
            .value {
              margin-top: 10px;
              font-size: 24px;
              font-weight: bold;
              color: #111827;
            }
            .sign {
              text-align: right;
            }
            .sign-name {
              margin-top: 18px;
              font-size: 28px;
              color: #3730a3;
            }
            .sign-line {
              margin-top: 10px;
              border-top: 1px solid #9ca3af;
              padding-top: 8px;
              font-size: 14px;
              color: #6b7280;
            }
            @media print {
              body { background: white; padding: 0; }
              .certificate { box-shadow: none; margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="top">Certificate of Completion</div>
            <h1>CHỨNG NHẬN HOÀN THÀNH</h1>
            <div class="sub">Trân trọng trao tặng chứng chỉ này cho</div>
            <div class="name">${learnerName}</div>
            <div class="sub">Chúc mừng bạn đã hoàn thành xuất sắc khóa học</div>
            <div class="course">“${courseName}”</div>
            <div class="desc">
              với kết quả <b>100% số câu trả lời chính xác</b>.
              Đây là minh chứng cho sự nỗ lực, tinh thần học tập nghiêm túc
              và sự kiên trì của bạn trong quá trình học tập.
            </div>

            <div class="footer">
              <div>
                <div class="label">Ngày cấp</div>
                <div class="value">${today}</div>
              </div>

              <div class="sign">
                <div class="label">Đơn vị cấp chứng nhận</div>
                <div class="sign-name">E-Learning System</div>
                <div class="sign-line">Đại diện hệ thống đào tạo</div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1200,height=900');
    if (!printWindow) {
      alert('Trình duyệt đã chặn cửa sổ in. Vui lòng cho phép popup.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-[70px] px-6 py-8 text-gray-700">Đang tải quiz...</main>
        <Footer />
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-[70px] px-6 py-8">
          <div className="max-w-4xl mx-auto p-4 rounded-xl bg-red-100 text-red-700 border border-red-200">
            {errMsg}
          </div>
          <div className="max-w-4xl mx-auto mt-4 flex gap-2">
            <button
              onClick={() => router.push(`/courses/${courseId}`)}
              className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600"
            >
              Quay lại khóa học
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const thumb = absUrl(course?.thumbnailUrl);
  const fallbackThumb = `${API_BASE}/uploads/coursesThumbnail/default.png`;

  const totalQ = questions.length;
  const correctCount = result?.correct ?? 0;
  const score10 = result?.score ?? 0;
  const star5 = totalQ ? Math.round((correctCount / totalQ) * 5) : 0;
  const isPerfectScore = !!result && totalQ > 0 && correctCount === totalQ;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="bg-white w-full z-2 pt-[45px]">
        <section className="z-0 hero bg-gradient-to-br from-indigo-500 to-white/10 p-4 flex xl:flex-row sm:flex-col items-center xl:justify-between sm:justify-center sm:gap-4 xl:gap-10 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-white after:via-indigo-500 after:to-white">
          <div className="flex items-center gap-4">
            <div className="w-[64px] h-[44px] rounded-xl overflow-hidden bg-white/40 border border-white/30">
              <img
                src={thumb || fallbackThumb}
                alt="thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackThumb;
                }}
              />
            </div>

            <div className="text-left">
              <div className="text-white/90 text-sm font-semibold">Quiz cuối khóa</div>
              <div className="text-white text-lg md:text-xl font-extrabold leading-tight">
                {course?.courseName || '—'}
              </div>
              <div className="text-white/80 text-xs mt-1">Mức độ: {levelLabel(course?.level)}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/courses/${courseId}`)}
              className="bg-white/90 hover:bg-white text-indigo-700 font-semibold px-4 py-2 rounded-xl shadow"
            >
              Quay lại
            </button>
          </div>
        </section>

        <section className="w-full px-6 py-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
                  {test?.testName || 'Bài quiz cuối khóa'}
                </h1>
                <div className="mt-2 text-sm text-gray-600">
                  Tổng số câu: <b>{questions.length}</b>
                </div>
              </div>

              {result && (
                <div className="p-5 border-b border-gray-100 bg-green-50">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="text-green-700 font-extrabold text-lg">Hoàn thành quiz</div>
                      <div className="mt-1 text-green-700">
                        Điểm: <b>{Number(score10).toFixed(2)}</b> / 10 — Đúng <b>{correctCount}</b> /{' '}
                        <b>{totalQ}</b>
                      </div>
                      <div className="mt-2">
                        <StarRow value={star5} />
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {isPerfectScore && (
                        <button
                          onClick={handlePrintCertificate}
                          className="px-4 py-2 rounded-xl bg-yellow-500 text-white font-semibold hover:bg-yellow-600"
                        >
                          In chứng chỉ
                        </button>
                      )}

                      <button
                        onClick={handleRetry}
                        className="px-4 py-2 rounded-xl bg-white border border-green-200 text-green-700 font-semibold hover:bg-green-100"
                      >
                        Làm lại
                      </button>
                      <button
                        onClick={() => router.push(`/courses/${courseId}`)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                      >
                        Về khóa học
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isPerfectScore && (
                <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-yellow-50 to-white">
                  <div className="mb-4 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800">
                    🎉 Chúc mừng bạn <b>{user?.fullName || user?.username || 'học viên'}</b> đã đạt
                    điểm tuyệt đối và được cấp chứng chỉ hoàn thành khóa học.
                  </div>

                  <CertificateCard
                    userName={user?.fullName || user?.username || 'Học viên'}
                    courseName={course?.courseName || 'Khóa học'}
                  />

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handlePrintCertificate}
                      className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                    >
                      In / Lưu PDF chứng chỉ
                    </button>
                  </div>
                </div>
              )}

              <div className="p-5">
                {!canUse ? (
                  <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800">
                    Bạn cần đăng nhập để làm quiz.
                  </div>
                ) : questions.length === 0 ? (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-600">
                    Quiz này chưa có câu hỏi.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((q, idx) => {
                      const qid = q.question_id;
                      const selectedAnswerId = answers[qid];
                      const d = details[qid];

                      return (
                        <div key={qid} className="border border-gray-200 rounded-2xl p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-bold text-gray-900">
                              Câu {idx + 1}: {q.questionContent || '—'}
                            </div>

                            {result && d && (
                              <div
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                  d.isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}
                              >
                                {d.isCorrect ? '✓ Đúng' : '✗ Sai'}
                              </div>
                            )}
                          </div>

                          <div className="mt-3 grid grid-cols-1 gap-2">
                            {(q.answers || []).map((a) => {
                              const active = selectedAnswerId === a.answer_id;

                              let cls =
                                'w-full text-left px-4 py-3 rounded-xl border transition font-semibold';

                              if (!result) {
                                cls += active
                                  ? ' bg-indigo-50 border-indigo-200 text-indigo-800'
                                  : ' bg-white border-gray-200 hover:bg-gray-50 text-gray-800';
                              } else {
                                if (active && d?.isCorrect) cls += ' bg-green-50 border-green-200 text-green-800';
                                else if (active && d && !d.isCorrect) cls += ' bg-red-50 border-red-200 text-red-800';
                                else cls += ' bg-white border-gray-200 text-gray-700';
                              }

                              return (
                                <button
                                  key={a.answer_id}
                                  type="button"
                                  className={cls}
                                  onClick={() => handleSelect(qid, a.answer_id)}
                                  disabled={!!result}
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-sm md:text-base">{a.answerContent}</span>
                                    {!result && active && (
                                      <span className="text-indigo-600 text-sm font-extrabold">✓</span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <div className="text-sm text-gray-600">
                        Chưa trả lời: <b>{unansweredCount}</b>
                      </div>

                      <button
                        onClick={handleSubmit}
                        disabled={submitting || !!result || questions.length === 0}
                        className={`px-5 py-3 rounded-xl font-semibold shadow-sm ${
                          submitting || result
                            ? 'bg-gray-300 text-white cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {submitting ? 'Đang nộp...' : result ? 'Đã nộp' : 'Nộp bài'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <aside className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm h-fit">
              <div className="text-lg font-bold text-gray-800 mb-2">Gợi ý</div>
              <div className="text-sm text-gray-600 space-y-2">
                <div>• Chọn đủ đáp án cho tất cả câu hỏi trước khi nộp.</div>
                <div>• Sau khi nộp bài sẽ hiện đúng/sai theo từng câu.</div>
                <div>• Bạn có thể “Làm lại” để tạo lượt làm bài mới.</div>
                <div>• Đạt 100% sẽ được cấp chứng chỉ hoàn thành khóa học.</div>
              </div>

              {!user && (
                <div className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
                  Bạn chưa đăng nhập.
                </div>
              )}
            </aside>
          </div>
        </section>

        <div className="px-6">
          <Footer />
        </div>
      </main>
    </div>
  );
}