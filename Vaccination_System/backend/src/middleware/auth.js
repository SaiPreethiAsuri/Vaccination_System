const jwt=require('jsonwebtoken');
authenticated=async(req,res,next)=>{
    try{
        const token=req.headers['authorization'];
        if(token==""){
            return res.status(401).json({
                message:'Unauthorized'
            })
        }
        const decoded=jwt.verify(token.split(' ')[1],process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
                message:'Unauthorized'
            })
        }
        req.user=decoded;
        next();
    }
    catch(err){
        res.status(500).json({
            message:err.message,
        })
    }
}
module.exports={authenticated}