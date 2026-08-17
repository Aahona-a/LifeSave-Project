const db=require('../config/db');
async function create(data,connection=db){ const [r]=await connection.execute('INSERT INTO notifications (user_id,title,message,type) VALUES (?,?,?,?)',[data.userId,data.title,data.message,data.type||'info']); return r.insertId; }
async function byUser(userId){ const [rows]=await db.execute('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 100',[userId]); return rows; }
async function markRead(id,userId){ const [r]=await db.execute('UPDATE notifications SET read_at=COALESCE(read_at,NOW()) WHERE notification_id=? AND user_id=?',[id,userId]); return r.affectedRows; }
module.exports={create,byUser,markRead};
