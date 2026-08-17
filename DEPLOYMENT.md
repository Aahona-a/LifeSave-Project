# LifeSave Deployment Guide

## Local XAMPP deployment
LifeSave needs XAMPP only for MySQL. Apache is not required because Express serves the frontend and API.

1. Start **MySQL** in XAMPP Control Panel.
2. Copy `.env.example` to `.env`.
3. Keep `DB_USER=root` and `DB_PASSWORD=` for the default XAMPP setup, or enter your own credentials.
4. Run `npm install`.
5. Run `npm run db:init`.
6. Run `npm start`.
7. Open `http://localhost:5000`.

## Manual phpMyAdmin setup
If you prefer phpMyAdmin, import `database.sql` directly. It creates and selects `lifesave_db` automatically, then run `npm start`.

## Production deployment
Use a Node.js host plus a managed MySQL server. Set `NODE_ENV=production`, use a strong `JWT_SECRET`, set the real database credentials, restrict `FRONTEND_ORIGIN`, serve behind HTTPS, and make the `uploads/profiles` directory persistent. Do not use the seeded demo passwords in production.
