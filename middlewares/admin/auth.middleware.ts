import Account from "../../models/accounts.model";
import { NextFunction, Response,Request } from "express";
import Role from "../../models/role.model";
import { systemConfig } from "../../config/system";


export const requireAuth=async (req:Request,res:Response,next:NextFunction):Promise<void> =>{
  if(!req.cookies.token){
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  }
  else {
    const user=await Account.findOne({token:req.cookies.token});
    if(!user){
      res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    } else {
      const role=await Role.findOne({
        _id:user.role_id
      }).select("title permissions");
      res.locals.user=user;
      res.locals.role=role;
      next();
    }
  }
};