import bcrypt from 'bcrypt';
import user from '../models/user.js';
import { errorHandler } from '../utils/error.js';

export const updateUser=async(req,res,next)=>{
    if(req.user.id!=req.params.id){
       return next(errorHandler(403,'You Are not Allow to update this user'));
    }
    if(req.body.password){
       if(req.body.password.length<6) return next(errorHandler(503,'Password Must at Least 6 Characters'));
       req.body.password=bcrypt.hashSync(req.body.password,10);
    }
    if(req.body.username){
        if(req.body.username.length<7 || req.body.username.length>20){
            return next(errorHandler(400,'Username Must be between 7 to 20 Character'));
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400,'Username Can Not Contains Space'));
        }
        if(req.body.username!=req.body.username.toLowerCase()){
            return next(errorHandler(400,'username must be lowercases'));
        }
        if(req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400,'username can only contain letter and Number spacial Character (^ , $)'));
        }
    }
    try{
        const updateuser=await user.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                profilePicture:req.body.profilePicture,
                password:req.body.password
            }
        },{new:true}
        );
        const {password:pass,...rest}=updateuser._doc;
        res.status(200).json(rest);
    }
    catch(err){
        next(err);
    }
}