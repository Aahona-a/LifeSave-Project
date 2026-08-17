# LifeSave – Full-Stack Completion Analysis

## 1. Project Analysis
The supplied project was a working frontend prototype with `index.html`, `login.html`, `register.html`, `style.css`, and `script.js`. Its strongest existing behaviors were donor search by blood group/location, gender-aware donation eligibility timing, Haversine distance calculation, emergency hotlines, masked donor phone display, donor registration checks, and a placeholder `/api/donors` integration. Those concepts have been preserved instead of replacing the project with an unrelated design.

The source also contained an older MongoDB/Mongoose target. The latest project requirement supersedes it, so the completed application uses MySQL/MariaDB through XAMPP and MySQL2.

## 2. Improved Architecture
Express serves both the frontend and REST API from one process at `http://localhost:5000`. The original page-based frontend remains plain HTML/CSS/Vanilla JavaScript. Backend responsibilities are separated into config, controllers, routes, models, middleware, services, and utilities without introducing an enterprise framework.

## 3. Folder Structure
```text
LifeSave-Project-FullStack/
├── public/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── profile.html
│   ├── requests.html
│   ├── donor-dashboard.html
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── styles/style.css
│   ├── scripts/*.js
│   └── assets/default-avatar.svg
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   └── utils/
├── uploads/profiles/
├── docs/Original_Current_Project.txt
├── database.sql
├── .env.example
├── server.js
├── package.json
├── API_DOCUMENTATION.md
├── DEPLOYMENT.md
└── README.md
```

## 4. Database Schema
The MySQL schema contains the required `users`, `donors`, `blood_requests`, `donations`, `notifications`, and `admins` tables. It includes primary keys, foreign keys, unique constraints, indexes for donor/request searches, status fields, timestamps, donor availability, protected account credentials, accepted donor linkage, and seeded demo data.

## 5. Backend Code
The Express backend implements registration/login, JWT authentication, profile management, profile image uploads, donor registration/search/contact protection, donor availability and last-donation updates, blood request posting/tracking/acceptance/completion, donation history, notifications, admin user/donor/request management, analytics, and reports.

## 6. Frontend Updates
The original red LifeSave identity, donor cards, search form, eligibility status, distance display, emergency hotline cards, registration donor toggle, and contact-protection concept are retained. The UI has been made responsive and extended with user, donor, request, profile, and admin pages rather than replacing the existing visual concept.

## 7. API Routes
The API includes `/api/auth/*`, `/api/profile/*`, `/api/donors/*`, `/api/blood-requests/*`, `/api/donations/*`, `/api/notifications/*`, and `/api/admin/*`. A compatibility alias `/api/blood-request` is also mounted for the singular route style requested in the specification. Full route documentation is in `API_DOCUMENTATION.md`.

## 8. Authentication System
Passwords are hashed with the bcrypt algorithm through `bcryptjs`. Successful authentication returns a signed JWT. Protected middleware verifies the token and checks that the account is active. Admin routes additionally require the `admin` role. Full donor phone numbers are available only through an authenticated contact endpoint.

Input validation uses `express-validator` plus server-side business-rule checks. Database statements use MySQL2 placeholders to mitigate SQL injection. User-supplied strings are sanitized server-side and escaped when rendered in dynamic frontend HTML. Helmet CSP, rate limiting, upload restrictions, centralized error handling, and role checks are included.

## 9. SQL File
`database.sql` is directly importable into phpMyAdmin and creates `lifesave_db` automatically. It also creates all required tables and seed records. `npm run db:init` uses the same SQL file and can substitute the database name from `.env` automatically.

## 10. README
`README.md` contains requirements, setup commands, XAMPP configuration, seed credentials, page list, database options, security notes, eligibility behavior, and run commands.

## 11. Installation Guide
For default XAMPP MySQL:
```bash
copy .env.example .env
npm install
npm run db:init
npm start
```
Then open `http://localhost:5000`.

On macOS/Linux use `cp .env.example .env` instead of `copy`.

## 12. Deployment Guide
`DEPLOYMENT.md` explains XAMPP deployment, manual phpMyAdmin import, and production requirements such as HTTPS, a strong JWT secret, real MySQL credentials, persistent uploads, production environment variables, and removal/change of seed credentials.

## Why the Existing Files Were Modified
- Frontend files were moved under `public/` only so the same Express server can serve them safely; their role and page flow remain intact.
- Inline mock login/registration alerts were replaced with real API calls because authentication and persistence are now implemented.
- The sample donor array became a database-backed donor API while a minimal browser fallback remains for resilience.
- Phone reveal now calls an authenticated API instead of relying on a hard-coded `isLoggedIn = false` variable.
- Eligibility and Haversine logic were retained and integrated with real donor data.
- Registration retains the original donor age/weight checks and now enforces them server-side as well.
- Additional dashboard/profile/request/admin pages were added because those required features did not exist in the original prototype.
- The old MongoDB target was removed because the latest specification explicitly requires MySQL + MySQL2 + XAMPP.
