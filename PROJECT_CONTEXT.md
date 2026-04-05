# Project Context Snapshot (Compact)

## What this app does
Career-counseling quiz app:
- Student fills lead form, gives answers, gets recommendation report.
- Admin can view students, manage questions, export CSV, download PDF reports.

## Stack
- Frontend: React 19 + TypeScript + Vite + Tailwind + Framer Motion
- Backend: Express 5 + TypeScript + PostgreSQL (`pg`) + Prisma schema definitions

## Actual architecture (important)
- Backend does **not** use Prisma client in runtime routes currently.
- Runtime DB calls are raw SQL via `pg.Pool` in:
  - `backend/src/server.ts`
  - `backend/src/routes/adminRoutes.ts`
- Prisma schema is currently used as schema contract/migration source.

## Core frontend flow
`frontend/src/App.tsx` app states:
- `landing` -> `form` -> `quiz` -> `analyzing` -> `report`
- admin path: `admin-login` -> `admin`

Persistence:
- localStorage key: `career_counselor_state`
- Stores: appState, userData, studentId, currentQuestionIndex, answers, result, timeLeft, shuffledQuestions

## Backend API map
Student:
- `POST /api/student/register`
- `POST /api/student/update-progress/:id`
- `POST /api/student/complete/:id`

Admin:
- `GET /api/admin/students?status=`
- `GET /api/admin/export`
- `GET /api/admin/report/:id`
- `GET /api/admin/report/generate?mobile=`
- `GET /api/admin/questions`
- `POST /api/admin/questions`
- `PUT /api/admin/questions/:id`
- `DELETE /api/admin/questions/:id`
- `DELETE /api/admin/student/:id`

## DB models (Prisma)
- `Student`: id, name, mobile, email, location, answers(Json), result(Json?), status, createdAt, updatedAt
- `Question`: id, text, options(Json), category, order, createdAt

## Key risk notes before making changes
- `frontend/src/data/questions.ts` has recommendation logic that always returns `commerce` stream.
- `frontend/src/sections/AdminLogin.tsx` uses hardcoded credentials (`admin/admin123`) on client side.
- `backend/src/routes/adminRoutes.ts` updates `Question.updatedAt`, but Prisma `Question` model does not define `updatedAt`.
- `backend/src/models/Student.ts` and `backend/src/models/Question.ts` are mongoose models and seem unused with current Postgres implementation.
- README says backend runs on 5000, code uses 5001.

## Fast edit guide (to save context later)
If you ask me to change something, mention one bucket:
- `quiz-ux` -> mostly `frontend/src/sections/QuizCard.tsx`, `frontend/src/App.tsx`
- `lead-form` -> `frontend/src/sections/LeadForm.tsx`
- `recommendation-logic` -> `frontend/src/data/questions.ts`
- `admin-ui` -> `frontend/src/sections/AdminPanel.tsx`, `frontend/src/sections/AdminLogin.tsx`
- `student-apis` -> `backend/src/server.ts`
- `admin-apis` -> `backend/src/routes/adminRoutes.ts`
- `pdf-layout` -> `backend/src/utils/pdfGenerator.ts`
- `db-schema` -> `backend/prisma/schema.prisma`

Using this bucket style will keep prompt/context small and edits faster.
