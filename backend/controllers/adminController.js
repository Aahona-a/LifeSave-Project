const db=require('../config/db');
const BloodRequest=require('../models/bloodRequestModel');
const Donation=require('../models/donationModel');
const Donor=require('../models/donorModel');
const asyncHandler=require('../utils/asyncHandler');
const AppError=require('../utils/AppError');
exports.users=asyncHandler(async(req,res)=>{ const [rows]=await db.query('SELECT user_id,name,email,phone,gender,role,status,created_at FROM users ORDER BY created_at DESC'); res.json({success:true,users:rows}); });
exports.donors=asyncHandler(async(req,res)=>res.json({success:true,donors:await Donor.list({})}));
exports.requests=asyncHandler(async(req,res)=>res.json({success:true,requests:await BloodRequest.all()}));
exports.analytics=asyncHandler(async(req,res)=>{ const [[u]]=await db.query('SELECT COUNT(*) total FROM users'); const donors=await Donor.count(); const donations=await Donation.count(); const requestStatus=await BloodRequest.countByStatus(); const [[available]]=await db.query('SELECT COUNT(*) total FROM donors WHERE is_available=1'); res.json({success:true,analytics:{users:u.total,donors,availableDonors:available.total,donations,requestStatus}}); });
exports.report=asyncHandler(async(req,res)=>{ const [bloodGroups]=await db.query('SELECT blood_group,COUNT(*) donors FROM donors GROUP BY blood_group ORDER BY blood_group'); const [monthly]=await db.query("SELECT DATE_FORMAT(donation_date,'%Y-%m') month,COUNT(*) donations,SUM(units) units FROM donations GROUP BY DATE_FORMAT(donation_date,'%Y-%m') ORDER BY month DESC LIMIT 12"); res.json({success:true,report:{bloodGroups,monthlyDonations:monthly}}); });
exports.userStatus=asyncHandler(async(req,res)=>{ if(!['active','suspended'].includes(req.body.status)) throw new AppError('Invalid status',422); if(Number(req.params.id)===req.user.user_id) throw new AppError('You cannot suspend your own account',400); const [r]=await db.execute('UPDATE users SET status=? WHERE user_id=?',[req.body.status,req.params.id]); if(!r.affectedRows) throw new AppError('User not found',404); res.json({success:true,message:'User status updated'}); });

exports.donorAvailability=asyncHandler(async(req,res)=>{ if(typeof req.body.isAvailable!=='boolean') throw new AppError('isAvailable must be true or false',422); const [r]=await db.execute('UPDATE donors SET is_available=? WHERE donor_id=?',[req.body.isAvailable?1:0,req.params.id]); if(!r.affectedRows) throw new AppError('Donor not found',404); res.json({success:true,message:'Donor availability updated'}); });
exports.requestStatus=asyncHandler(async(req,res)=>{ if(!['open','accepted','completed','cancelled'].includes(req.body.status)) throw new AppError('Invalid request status',422); const r=await BloodRequest.findById(req.params.id); if(!r) throw new AppError('Request not found',404); res.json({success:true,message:'Request status updated',request:await BloodRequest.setStatus(req.params.id,req.body.status)}); });
