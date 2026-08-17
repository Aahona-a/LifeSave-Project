const bcrypt=require('bcryptjs');
const db=require('../config/db');
const User=require('../models/userModel');
const Donor=require('../models/donorModel');
const Admin=require('../models/adminModel');
const {signToken}=require('../services/tokenService');
const {clean}=require('../utils/sanitize');
const asyncHandler=require('../utils/asyncHandler');
const AppError=require('../utils/AppError');
function authPayload(user,token){ return {success:true,token,user:{userId:user.user_id,name:user.name,email:user.email,phone:user.phone,gender:user.gender,role:user.role,profileImage:user.profile_image,city:user.city,district:user.district}}; }
exports.register=asyncHandler(async(req,res)=>{
  const data=clean(req.body); const existing=await User.findByEmail(data.email); if(existing) throw new AppError('Email is already registered',409);
  if(data.isDonor && (!data.bloodGroup || !data.age || !data.weight || !data.location)) throw new AppError('Blood group, age, weight and location are required for donor registration',422);
  if(data.isDonor && Number(data.weight)<50) throw new AppError('Donors must weigh at least 50 kg',422);
  const passwordHash=await bcrypt.hash(data.password,10); const conn=await db.getConnection();
  try{ await conn.beginTransaction(); const user=await User.create({...data,passwordHash,role:'user'},conn); if(data.isDonor) await Donor.create({userId:user.user_id,bloodGroup:data.bloodGroup,age:Number(data.age),weight:Number(data.weight),location:data.location,latitude:data.latitude,longitude:data.longitude,lastDonation:data.lastDonation,isAvailable:true},conn); await conn.commit(); const token=signToken(user); res.status(201).json(authPayload(user,token)); }catch(e){await conn.rollback();throw e}finally{conn.release()}
});
exports.login=asyncHandler(async(req,res)=>{ const user=await User.findByEmail(req.body.email); if(!user||!(await bcrypt.compare(req.body.password,user.password_hash))) throw new AppError('Invalid email or password',401); if(user.status!=='active') throw new AppError('Your account is not active',403); res.json(authPayload(user,signToken(user))); });
exports.adminLogin=asyncHandler(async(req,res)=>{ const user=await User.findByEmail(req.body.email); if(!user||user.role!=='admin'||!(await bcrypt.compare(req.body.password,user.password_hash))) throw new AppError('Invalid admin credentials',401); if(!await Admin.byUserId(user.user_id)) throw new AppError('Admin profile not configured',403); res.json(authPayload(user,signToken(user))); });
exports.me=asyncHandler(async(req,res)=>res.json({success:true,user:req.user}));
exports.logout=(req,res)=>res.json({success:true,message:'Logged out. Remove the token from the client.'});
