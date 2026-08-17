const Donor=require('../models/donorModel');
const Donation=require('../models/donationModel');
const asyncHandler=require('../utils/asyncHandler');
const AppError=require('../utils/AppError');
exports.mine=asyncHandler(async(req,res)=>res.json({success:true,donations:await Donation.byUser(req.user.user_id)}));
exports.create=asyncHandler(async(req,res)=>{ const donor=await Donor.findByUserId(req.user.user_id); if(!donor) throw new AppError('Donor profile required',403); const date=req.body.donationDate||new Date().toISOString().slice(0,10); const id=await Donation.create({donorId:donor.donor_id,requestId:req.body.requestId,donationDate:date,units:req.body.units||1,hospital:req.body.hospital,notes:req.body.notes}); await Donor.updateLastDonation(req.user.user_id,date); res.status(201).json({success:true,message:'Donation recorded',donationId:id}); });
