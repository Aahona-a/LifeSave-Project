const db = require('../config/db');
async function findByEmail(email, connection = db) {
  const [rows] = await connection.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
}
async function findById(id, connection = db) {
  const [rows] = await connection.execute('SELECT user_id, name, email, phone, gender, role, profile_image, city, district, latitude, longitude, status, created_at, updated_at FROM users WHERE user_id = ? LIMIT 1', [id]);
  return rows[0] || null;
}
async function create(data, connection = db) {
  const [r] = await connection.execute('INSERT INTO users (name,email,phone,gender,password_hash,role,city,district,latitude,longitude) VALUES (?,?,?,?,?,?,?,?,?,?)', [data.name, data.email, data.phone, data.gender, data.passwordHash, data.role || 'user', data.city || null, data.district || null, data.latitude ?? null, data.longitude ?? null]);
  return findById(r.insertId, connection);
}
async function update(id, data, connection = db) {
  const fields = [], values = [];
  const map = { name: 'name', phone: 'phone', gender: 'gender', city: 'city', district: 'district', latitude: 'latitude', longitude: 'longitude', profileImage: 'profile_image' };
  for (const [key, col] of Object.entries(map)) if (data[key] !== undefined) { fields.push(`${col} = ?`); values.push(data[key] || null); }
  if (!fields.length) return findById(id, connection);
  values.push(id);
  await connection.execute(`UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`, values);
  return findById(id, connection);
}
async function setPassword(id, hash, connection = db) { await connection.execute('UPDATE users SET password_hash = ? WHERE user_id = ?', [hash, id]); }
module.exports = { findByEmail, findById, create, update, setPassword };
