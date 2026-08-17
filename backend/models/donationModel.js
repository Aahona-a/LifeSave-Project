const db = require('../config/db');
async function create(data, connection=db){ const [r]=await connection.execute('INSERT INTO donations (donor_id,request_id,donation_date,units,hospital,notes) VALUES (?,?,?,?,?,?)',[data.donorId,data.requestId||null,data.donationDate,data.units||1,data.hospital||null,data.notes||null]); return r.insertId; }
async function byUser(userId){ const [rows]=await db.execute('SELECT dn.*,br.patient_name,br.blood_group FROM donations dn JOIN donors d ON d.donor_id=dn.donor_id LEFT JOIN blood_requests br ON br.request_id=dn.request_id WHERE d.user_id=? ORDER BY dn.donation_date DESC',[userId]); return rows; }
async function count(){ const [[row]]=await db.query('SELECT COUNT(*) total FROM donations'); return row.total; }
module.exports={create,byUser,count};
