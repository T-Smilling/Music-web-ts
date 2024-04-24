import { Request, Response } from "express";
import md5 from "md5";
import { systemConfig } from "../../config/system";
import Account from "../../models/accounts.model";
import Role from "../../models/role.model";
import { filterStatusHelper } from "../../helpers/filterStatus.helper";
import paginationHelper from "../../helpers/pagination.helper";
// [GET] /admin/accounts/
export const index = async (req: Request, res: Response) => {
  try {
    interface Find{
      deleted:boolean,
      status?:string|any,
      fullName?:RegExp,
    }
    const find:Find={
      deleted:false
    }
    if(req.query.status){
      find.status=req.query.status;
    }
    const filterStatus=filterStatusHelper(req.query);

    //Search
    interface Search{
      keyword:string|any
    }
    const objectSearch:Search={
      keyword:"",
    }
    if(req.query.keyword){
      objectSearch.keyword=req.query.keyword;
      const regex:RegExp=new RegExp(objectSearch.keyword,"i");
      find.fullName=regex;
    }
    //End Search

    //Pagination
    let initPagination={
      currentPage:1,
      limitItems:3,
    }
    const countTasks= await Account.countDocuments(find);
    let objectPagination=paginationHelper(
      initPagination,
      req.query,
      countTasks
    );
    //End Pagination

    //Sort
    const sort={};
    if(req.query.sortKey && req.query.sortValue){
      const sortKey=req.query.sortKey.toLocaleString();
      sort[sortKey]=req.query.sortValue;
    }   
    //End Sort

    const records = await Account.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip).select("-password -token");

    const newRecord=[];
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
      records:newRecord,
      keyword:objectSearch.keyword,
      filterStatus:filterStatus,
      pagination:objectPagination
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
//[PATCH] /admin/accounts/change-status/:status/:id

export const changeStatus= async (req: Request, res: Response) =>{
  const status:string=req.params.status;
  const id:string=req.params.id;
  // const updatedBy={
  //   account_id: res.locals.user.id,
  //   updatedAt: new Date()
  // }
  await Account.updateOne({_id: id},
  { 
    status: status,
  });
  
  res.redirect("back");
}

//[PATCH] /admin/accounts/change-multi

export const changeMulti= async (req: Request, res: Response) =>{
  const type:string=req.body.type;
  const ids:string=req.body.ids.split(", ");
  // const updatedBy={
  //   account_id: res.locals.user.id,
  //   updatedAt: new Date()
  // }
  switch (type) {
    case "active":
      await Account.updateMany( {_id: { $in: ids }}, {status: "active"});
      break;
    case "inactive":
      await Account.updateMany( {_id: { $in: ids }}, {status: "inactive"});
      break;
    case "delete-all":
      await Account.updateMany(
      {_id: { $in: ids }},
      {
        deleted: true,
        // deletedBy:{
        //   account_id:res.locals.user.id,
        //   deletedAt: new Date(),
        // }
      });
      break;
    default:
      break;
  }
  res.redirect("back");
}
