import { Request, Response } from "express";
import md5 from "md5";
import User from "../../models/user.model";

// [GET] /admin/users/
export const index = async (req: Request, res: Response) => {
  try {
    let find={
      deleted:false
    };
    const newRecord=[];
    const records=await User.find(find).select("-password -token");
    for(const record of records){
      newRecord.push({
        id:record.id,
        fullName: record.fullName, 
        email: record.email,
        status:record.status,
      });
    }
    res.render("admin/pages/users/index",{
      pageTitle:"Tài khoản User",
      records:newRecord
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};
// [GET] /admin/users/detail/:idUser
export const detail = async (req: Request, res: Response) => {
  try {
    const idUser:string=req.params.idUser;
    const user=await User.findOne({
      _id:idUser,
      deleted:false
    }).select("-password -token");
    res.render("admin/pages/users/detail",{
      pageTitle:"Chi tiết tài khoản",
      user:user
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};
// [GET] /admin/users/edit/:idUser
export const edit = async (req: Request, res: Response) => {
  try {
    const idUser:string=req.params.idUser;
    const user=await User.findOne({
      _id:idUser,
      deleted:false
    });
    res.render("admin/pages/users/edit",{
      pageTitle:"Chỉnh sửa tài khoản",
      user:user
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};
// [POST] /admin/users/edit/:idUser
export const editPost = async (req: Request, res: Response) => {
  try {
    const idUser:string=req.params.idUser;
    if(req.body.password){
      req.body.password=md5(req.body.password);
    };
    await User.updateOne({
      _id:idUser
    },req.body);
    res.redirect("back");
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};
// [DELETE] /admin/users/detele/:idUser
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const idUser:string=req.params.idUser;
    await User.updateOne({
      _id:idUser
    },{deleted:true});
    res.redirect("back");
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};
