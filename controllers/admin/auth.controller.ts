import { Request, Response } from "express";
import Account from "../../models/accounts.model";
import md5 from "md5";
import { systemConfig } from "../../config/system";


// [GET] /admin/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/auth/login",{
      pageTitle:"Đăng nhập",
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

//[POST] admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  try {
    const email:string=req.body.email;
    const password:string=req.body.password;
    const user= await Account.findOne({
      email:email,
      deleted:false
    });
    if(!user){
      res.redirect("back");
      return;
    }
    if(md5(password) != user.password){
      res.redirect("back");
      return;
    }
    if(user.status == "inactive"){
      res.redirect("back");
      return;
    }
    res.cookie("token",user.token);
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [GET] /admin/auth/logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};