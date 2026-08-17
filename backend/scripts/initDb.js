require('dotenv').config();
const fs=require('fs');
const path=require('path');
const mysql=require('mysql2/promise');
(async()=>{
  const connection=await mysql.createConnection({host:process.env.DB_HOST||'127.0.0.1',port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER||'root',password:process.env.DB_PASSWORD||'',multipleStatements:true});
  try{
    let sql=fs.readFileSync(path.join(__dirname,'../../database.sql'),'utf8');
    const dbName=(process.env.DB_NAME||'lifesave_db').replace(/[^a-zA-Z0-9_]/g,'');
    sql=sql.replaceAll('`lifesave_db`', `\`${dbName}\``);
    await connection.query(sql);
    console.log(`Database ${dbName} created/updated successfully.`);
    console.log('Seed admin: admin@lifesave.local / admin123');
    console.log('Seed donor: abdullah@lifesave.local / donor123');
  } finally { await connection.end(); }
})().catch(err=>{ console.error('Database initialization failed:',err.message); process.exit(1); });
