const db=require('../config/db');
async function byUserId(userId){ const [rows]=await db.execute('SELECT * FROM admins WHERE user_id=? LIMIT 1',[userId]); return rows[0]||null; }
module.exports={byUserId};
