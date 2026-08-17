const db = require('../config/db');
const baseSelect = `SELECT d.donor_id,d.user_id,d.blood_group,d.age,d.weight,d.location,d.latitude,d.longitude,d.last_donation_date,d.is_available,d.created_at,u.name,u.gender,u.profile_image,u.phone FROM donors d JOIN users u ON u.user_id=d.user_id WHERE u.status='active'`;
async function list(filters = {}) {
  let sql = baseSelect, params = [];
  if (filters.bloodGroup) { sql += ' AND d.blood_group = ?'; params.push(filters.bloodGroup); }
  if (filters.location) { sql += ' AND d.location LIKE ?'; params.push(`%${filters.location}%`); }
  if (filters.available !== undefined) { sql += ' AND d.is_available = ?'; params.push(filters.available ? 1 : 0); }
  sql += ' ORDER BY d.is_available DESC, d.updated_at DESC';
  const [rows] = await db.execute(sql, params); return rows;
}
async function findById(id) { const [rows] = await db.execute(`${baseSelect} AND d.donor_id = ? LIMIT 1`, [id]); return rows[0] || null; }
async function findByUserId(userId) { const [rows] = await db.execute(`${baseSelect} AND d.user_id = ? LIMIT 1`, [userId]); return rows[0] || null; }
async function create(data, connection = db) {
  const [r] = await connection.execute('INSERT INTO donors (user_id,blood_group,age,weight,location,latitude,longitude,last_donation_date,is_available) VALUES (?,?,?,?,?,?,?,?,?)', [data.userId,data.bloodGroup,data.age,data.weight,data.location,data.latitude ?? null,data.longitude ?? null,data.lastDonation || null,data.isAvailable === false ? 0 : 1]);
  return r.insertId;
}
async function updateAvailability(userId, value) { await db.execute('UPDATE donors SET is_available=? WHERE user_id=?', [value ? 1 : 0, userId]); return findByUserId(userId); }
async function updateLastDonation(userId, date) { await db.execute('UPDATE donors SET last_donation_date=? WHERE user_id=?', [date || null, userId]); return findByUserId(userId); }
async function count() { const [[row]] = await db.query('SELECT COUNT(*) total FROM donors'); return row.total; }
module.exports = { list, findById, findByUserId, create, updateAvailability, updateLastDonation, count };
