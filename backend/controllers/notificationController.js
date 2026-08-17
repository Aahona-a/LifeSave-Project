const Notification=require('../models/notificationModel');
const asyncHandler=require('../utils/asyncHandler');
const AppError=require('../utils/AppError');
exports.list=asyncHandler(async(req,res)=>res.json({success:true,notifications:await Notification.byUser(req.user.user_id)}));
exports.read=asyncHandler(async(req,res)=>{ if(!await Notification.markRead(req.params.id,req.user.user_id)) throw new AppError('Notification not found',404); res.json({success:true,message:'Notification marked as read'}); });
