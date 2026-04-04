import { apiFetch } from "@/lib/api";

export const quizService = {
  listByCourse(courseId) {
    return apiFetch(`/api/courses/${courseId}/tests`); // { tests }
  },
  detail(testId) {
    return apiFetch(`/api/tests/${testId}`); // { test }
  },
  questions(testId) {
    return apiFetch(`/api/tests/${testId}/questions`); // { questions:[{..., answers:[]}] }
  },
  submit(testId, payload) {
    return apiFetch(`/api/tests/${testId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
};
