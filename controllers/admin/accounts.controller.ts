import { Request, Response } from "express";
import md5 from "md5";
import { systemConfig } from "../../config/system";
import Account from "../../models/accounts.model";
import Role from "../../models/role.model";
// [GET] /admin/accounts/
export const index = async (req: Request, res: Response) => {
  try {
    let find={
      deleted:false
    };
    const newRecord=[];
    const records=await Account.find(find).select("-password -token");
    for(const record of records){
      const role=await Role.findOne({
        _id:record.role_id,
        deleted:false
      });
      newRecord.push({
        id:record.id,
        fullName: record.fullName, 
        email: record.email,
        phone:record.phone,
        role:role.title,
        status:record.status,
      });
    }
    res.render("admin/pages/accounts/index",{
      pageTitle:"Tài khoản Admin",
      records:newRecord
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [GET] /admin/accounts/create
export const create = async (req: Request, res: Response) => {
  try {
    let find={
      deleted:false
    }
    const records=await Role.find(find);
    res.render("admin/pages/accounts/create" ,{
      pageTitle: "Tạo mới tài khoản",
      records:records
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

//[POST] admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const emailExist=await Account.findOne({
      email:req.body.email,
      deleted: false
    });
    if(emailExist){
      res.redirect("back");
    }
    else{
      req.body.password=md5(req.body.password);
      const records=new Account(req.body);
      await records.save();
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};
// [GET] /admin/accounts/detail/:idAccount
export const detail = async (req: Request, res: Response) => {
  try {
    const idAccount:string=req.params.idAccount;
    let find={
      deleted:false,
      _id:idAccount
    };
    const newRecord=[];
    const record=await Account.findOne(find).select("-password -token");
    const role=await Role.findOne({
      _id:record.role_id,
      deleted:false
    });
    newRecord.push({
      id:record.id,
      fullName: record.fullName, 
      email: record.email,
      phone:record.phone,
      role:role.title,
      status:record.status,
    });
    res.render("admin/pages/accounts/detail",{
      pageTitle:"Tài khoản Admin",
      record:newRecord[0]
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [GET] /admin/accounts/edit/:idAccount
export const edit = async (req: Request, res: Response) => {
  try {
    const idAccount:string=req.params.idAccount;
    let find={
      deleted:false,
      _id:idAccount
    };
    const newRecord=[];
    const record=await Account.findOne(find).select("-password -token");
    const role=await Role.findOne({
      _id:record.role_id,
      deleted:false
    });
    const recordRole=await Role.find({
      deleted:false
    })
    newRecord.push({
      id:record.id,
      fullName: record.fullName, 
      email: record.email,
      phone:record.phone,
      role:role.title,
      status:record.status,
    });
    res.render("admin/pages/accounts/edit",{
      pageTitle:"Chỉnh sửa tài khoản",
      record:newRecord[0],
      recordRole:recordRole
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [POST] /admin/accounts/edit/:idAccount
export const editPost = async (req: Request, res: Response) => {
  try {
    const idAccount:string=req.params.idAccount;
    if(req.body.password){
      req.body.password=md5(req.body.password);
    }
    await Account.updateOne({
      _id:idAccount
    },req.body);
    res.redirect("back")
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [DELETE] /admin/accounts/delete/:idAccount
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const idAccount:string=req.params.idAccount;
    await Account.updateOne({
      _id:idAccount
    },{deleted:true});
    res.redirect("back")
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};