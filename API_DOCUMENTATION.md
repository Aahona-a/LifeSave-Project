# LifeSave API Documentation

Base URL: `http://localhost:5000/api`

Protected endpoints require `Authorization: Bearer <JWT>`.

## Authentication
- `POST /auth/register` - Register user and optionally donor.
- `POST /auth/login` - User login.
- `GET /auth/me` - Current authenticated user.
- `POST /auth/logout` - Stateless logout acknowledgement.

## Profile
- `GET /profile`
- `PUT /profile`
- `PUT /profile/password`
- `POST /profile/image` - multipart field `profileImage`.

## Donors
- `GET /donors?bloodGroup=A%2B&location=Dhaka&available=true&lat=23.75&lon=90.39`
- `GET /donors/:id`
- `GET /donors/:id/contact` - protected full phone number.
- `GET /donors/me`
- `POST /donors/become`
- `PATCH /donors/availability`
- `PATCH /donors/last-donation`

## Blood Requests
Both `/blood-requests` and the compatibility alias `/blood-request` are mounted.
- `POST /blood-requests`
- `GET /blood-requests/open` - protected; returns active requests to signed-in users
- `GET /blood-requests/mine`
- `GET /blood-requests/:id`
- `POST /blood-requests/:id/accept`
- `PATCH /blood-requests/:id/status`
- `POST /blood-requests/:id/complete`

## Donations
- `GET /donations/mine`
- `POST /donations`

## Notifications
- `GET /notifications`
- `PATCH /notifications/:id/read`

## Admin
- `POST /admin/login`
- `GET /admin/users`
- `PATCH /admin/users/:id/status`
- `GET /admin/donors`
- `GET /admin/blood-requests`
- `GET /admin/analytics`
- `GET /admin/reports`

## Common Response Format
Success responses use `{ "success": true, ... }` for object endpoints. The public donor list intentionally returns an array to remain compatible with the original frontend placeholder behavior.

Errors use `{ "success": false, "message": "..." }` with appropriate HTTP status codes.
