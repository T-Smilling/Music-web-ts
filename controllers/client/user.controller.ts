import md5 from "md5";
import { Request,Response } from "express";
import User from "../../models/user.model";
import ForgotPassword from "../../models/forgot-password.model";

import {generateRandomString,generateRandomNumber} from "../../helpers/generate.helper";
import {sendMail} from "../../helpers/sendMail.helper";

export const register = async (req:Request,res:Response) =>{
  try {
    res.render("client/pages/user/register",{
      pageTitle:"Đăng kí tài khoản",
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
}

//[POST] user/register/
export const registerPost= async (req:Request,res:Response) =>{
  try {
    const existEmail=await User.findOne({
      email:req.body.email,
      deleted:false
    });
    if(existEmail){
      res.json({
        code:400,
        message:"Email đã tồn tại!"
      });
    }
    else{
      req.body.password=md5(req.body.password);
      req.body.token=generateRandomString(30);
      const user=new User(req.body);
      const data = await user.save();
      res.json({
        code:200,
        message:"Tạo tài khoản thành công!",
        token:data.token
      });
    }
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};
//[GET] user/login/
export const login = async (req:Request,res:Response) =>{
  try {
    res.render("client/pages/user/login",{
      pageTitle:"Đăng nhập tài khoản",
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
}
//[POST] user/login/
export const loginPost=async (req:Request,res:Response)=>{ 
  try {
    const email:string=req.body.email;
    const password:string=req.body.password;
    const user=await User.findOne({
      email:email,
      deleted:false
    });
    if(!user){
      res.json({
        code:400,
        message:"Email không tồn tại!"
      });
      return;
    }
    if(md5(password) != user.password){
      res.json({
        code:401,
        message:"Sai mật khẩu!"
      });
      return;
    }
    const token:string=user.token;
    res.json({
      code:200,
      message:"Đăng nhập thành công",
      token:token
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
}
//[GET] user/logout
export const logout=async (req:Request,res:Response) =>{
  res.clearCookie("tokenUser");
  res.redirect("/topics");
}

//[GET] user/password/forgot/
export const forgotPass=async (req:Request,res:Response)=>{
  res.render("client/pages/user/forgot",{
    pageTitle:"Quên mật khẩu",
  })
}
//[POST] user/password/forgot/
export const forgotPassword=async(req:Request,res:Response)=>{
  try {
    const email:string=req.body.email;
    const existEmail=await User.findOne({
      email:email,
      deleted:false
    });
    if(!existEmail){
      res.json({
        code:400,
        message:"Email không tồn tại!"
      })
      return;
    }
    const otp:String=generateRandomNumber(8);
    //Việc 1: Lưu vào database
    const objectForgotPassword={
      email:email,
      otp:otp,
      expireAt: Date.now() + 5*60*1000
    };
    const forgotPassword= new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
  
    //Việc 2: Gửi OTP qua email của user
    const subject=`Mã OTP lấy lại mật khẩu`;
    const content=`Mã OTP lấy lại mật khẩu là ${otp}. Vui lòng không chia sẻ cho bất kì ai mã OTP này. Mã có hiệu lực 5 phút.`;
    sendMail(email,subject,content);
    res.render("client/pages/user/otp-password",{
      pageTitle:"Nhập OTP",
      email:email
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 NOT FOUND",
    })
  }
};

 //[POST] user/password/otp
export const otp=async (req:Request,res:Response)=>{
  try {
    const email:string=req.body.email;
    const otp:string=req.body.otp;
    const result=await ForgotPassword.findOne({
      email:email,
      otp:otp
    });
    if(!result){
      res.json({
        code:400,
        message:"OTP không tồn tại!"
      });
      return;
    }
    const user=await User.findOne({
      email:email
    });
    res.cookie("tokenUser",user.token);
    res.render("client/pages/user/reset-password",{
      pageTitle:"Nhập OTP",
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 NOT FOUND",
    })
  }
}

// //[POST] user/password/reset
export const resetPassword=async(req:Request,res:Response)=>{
  try {
    const token:string=req.cookies.tokenUser;
    const password:string=req.body.password;
    const user=await User.findOne({
      token:token,
      deleted:false
    });
    if(!user){
      res.json({
        code:400,
        message:"Tài khoản không tồn tại!"
      })
      return;
    }
    await User.updateOne({
      token:token
    },{
      password:md5(password)
    });
    res.redirect("/");
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 NOT FOUND",
    })
  }
}
