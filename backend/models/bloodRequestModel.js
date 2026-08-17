const db = require('../config/db');
const base = `SELECT br.*,u.name requester_name,d.user_id accepted_donor_user_id,du.name accepted_donor_name FROM blood_requests br JOIN users u ON u.user_id=br.requester_user_id LEFT JOIN donors d ON d.donor_id=br.accepted_donor_id LEFT JOIN users du ON du.user_id=d.user_id`;
async function create(data, connection = db) {
  const [r] = await connection.execute('INSERT INTO blood_requests (requester_user_id,blood_group,patient_name,units,hospital,location,city,latitude,longitude,needed_at,urgency,contact_phone,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [data.userId,data.bloodGroup,data.patientName,data.units,data.hospital,data.location,data.city || null,data.latitude ?? null,data.longitude ?? null,data.neededAt,data.urgency,data.contactPhone,data.notes || null]);
  return r.insertId;
}
async function findById(id) { const [rows] = await db.execute(`${base} WHERE br.request_id=? LIMIT 1`, [id]); return rows[0] || null; }
async function mine(userId) { const [rows] = await db.execute(`${base} WHERE br.requester_user_id=? ORDER BY br.created_at DESC`, [userId]); return rows; }
async function open(filters={}) { let sql=`${base} WHERE br.status='open'`,p=[]; if(filters.bloodGroup){sql+=' AND br.blood_group=?';p.push(filters.bloodGroup)} sql+=' ORDER BY FIELD(br.urgency,\'critical\',\'urgent\',\'normal\'),br.needed_at ASC'; const [rows]=await db.execute(sql,p); return rows; }
async function accept(id, donorId, connection = db) { const [r]=await connection.execute("UPDATE blood_requests SET status='accepted',accepted_donor_id=?,accepted_at=NOW() WHERE request_id=? AND status='open'",[donorId,id]); return r.affectedRows; }
async function setStatus(id,status) { await db.execute('UPDATE blood_requests SET status=? WHERE request_id=?',[status,id]); return findById(id); }
async function all() { const [rows]=await db.query(`${base} ORDER BY br.created_at DESC`); return rows; }
async function countByStatus(){ const [rows]=await db.query('SELECT status,COUNT(*) total FROM blood_requests GROUP BY status'); return rows; }
module.exports={create,findById,mine,open,accept,setStatus,all,countByStatus};
