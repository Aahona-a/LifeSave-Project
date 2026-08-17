# LifeSave – Smart Blood Donation & Emergency Support System

LifeSave is a full-stack continuation of the supplied frontend prototype. It keeps the red LifeSave identity, donor search, location filtering, donor eligibility idea, Haversine distance calculation, emergency hotlines and protected donor contact behavior, while adding a real Express/MySQL backend, JWT authentication, dashboards, blood request workflows, uploads and admin tools.

## Stack
- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js + Express.js
- Database: MySQL/MariaDB via XAMPP + MySQL2
- Authentication: JWT + bcrypt-compatible password hashing via `bcryptjs`
- Security: Helmet, rate limiting, validation, parameterized SQL, XSS string sanitization, role checks

## Requirements
- Node.js 18 or newer
- XAMPP with MySQL/MariaDB running
- npm

## Fastest Setup (Windows + XAMPP)
1. Extract the project.
2. Start **MySQL** from XAMPP Control Panel. Apache is optional.
3. Open a terminal in the project folder.
4. Run:

```bash
copy .env.example .env
npm install
npm run db:init
npm start
```

5. Open `http://localhost:5000`.

For macOS/Linux, use `cp .env.example .env` instead of `copy`.

## Default local database settings
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=lifesave_db
```

If XAMPP MySQL uses a different port or root password, update `.env` before running `npm run db:init`.

## Seed Accounts
- Admin: `admin@lifesave.local` / `admin123`
- Donor: `abdullah@lifesave.local` / `donor123`
- User: `rahim@lifesave.local` / `user123`

Change or delete seed accounts before real deployment.

## Main Pages
- `/index.html` - donor search and emergency hotlines
- `/login.html` - user login
- `/register.html` - user/donor registration
- `/dashboard.html` - user dashboard
- `/profile.html` - profile and password management
- `/donor-dashboard.html` - donor tools and donation history
- `/requests.html` - post/track/accept blood requests
- `/admin-login.html` - admin login
- `/admin-dashboard.html` - management, analytics and reports

## Database Setup Options
### Option A: Automatic
`npm run db:init` reads `database.sql`, creates the configured database and inserts seed data.

### Option B: phpMyAdmin
Import `database.sql` directly through phpMyAdmin. It creates and selects `lifesave_db` automatically.

## Security Notes
Passwords are never stored in plain text. SQL queries use placeholders through MySQL2. JWT-protected routes validate the token on every request. Admin routes require the `admin` role. Full donor phone numbers are only exposed through an authenticated endpoint. Uploaded profile images are restricted by MIME type and size.

## Eligibility Logic
To preserve the original project behavior, LifeSave uses a 90-day interval for male donors and 120 days for female donors, together with donor availability. This is project logic, not medical advice; real deployment should use current local blood-donation regulations and clinical guidance.

## Run Commands
```bash
npm install
npm run db:init
npm start
```
Development auto-reload (Node 18+):
```bash
npm run dev
```

## Documentation
- `API_DOCUMENTATION.md` - REST routes
- `DEPLOYMENT.md` - local and production deployment
- `database.sql` - complete schema and seed data
- `.env.example` - configuration template

## Folder Design
The original root frontend files are moved into `public/` only so Express can serve them safely from the same process. Their purpose and UI flow are preserved. Backend logic is separated into `controllers`, `routes`, `models`, `middleware`, `config`, `services`, and `utils` for maintainability without adding an enterprise framework.
