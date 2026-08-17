const bcrypt=require('bcryptjs');
const User=require('../models/userModel');
const {clean}=require('../utils/sanitize');
const asyncHandler=require('../utils/asyncHandler');
const AppError=require('../utils/AppError');
exports.get=asyncHandler(async(req,res)=>res.json({success:true,user:req.user}));
exports.update=asyncHandler(async(req,res)=>{ const data=clean(req.body); const user=await User.update(req.user.user_id,{name:data.name,phone:data.phone,gender:data.gender,city:data.city,district:data.district,latitude:data.latitude,longitude:data.longitude}); res.json({success:true,message:'Profile updated',user}); });
exports.changePassword=asyncHandler(async(req,res)=>{ const full=await User.findByEmail(req.user.email); if(!req.body.currentPassword||!req.body.newPassword||req.body.newPassword.length<6) throw new AppError('Current password and a new password of at least 6 characters are required',422); if(!await bcrypt.compare(req.body.currentPassword,full.password_hash)) throw new AppError('Current password is incorrect',400); await User.setPassword(req.user.user_id,await bcrypt.hash(req.body.newPassword,10)); res.json({success:true,message:'Password changed successfully'}); });
exports.uploadImage=asyncHandler(async(req,res)=>{ if(!req.file) throw new AppError('No image uploaded',400); const relative=`/uploads/profiles/${req.file.filename}`; const user=await User.update(req.user.user_id,{profileImage:relative}); res.json({success:true,message:'Profile image updated',profileImage:relative,user}); });
