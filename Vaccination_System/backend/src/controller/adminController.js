const adminModal = require('../models/AdminModel');
const jwt = require('jsonwebtoken')
adminLogin=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user=await adminModal.findOne({username:username,password:password});
        if(user){
            const payload={
                username:user.username,
                id:user._id,
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:'20m',
            })  
            res.status(200).json({
                message:'Login Successful',
                token: `Bearer ${token}`
            })
        }
        else{
            res.status(401).json({
                message:'Invalid Credentials',
            })
        }
    }
    catch(err){
        res.status(500).json({
            message:err.message,
        })
    }  
}
module.exports={adminLogin}