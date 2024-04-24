import { Request, Response } from "express";
import md5 from "md5";
import User from "../../models/user.model";
import paginationHelper from "../../helpers/pagination.helper";
import { filterStatusHelper } from "../../helpers/filterStatus.helper";

// [GET] /admin/users/
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
    const countTasks= await User.countDocuments(find);
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

    const records = await User.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip).select("-password -token");
    const newRecord=[];
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

//[PATCH] /admin/users/change-status/:status/:id

export const changeStatus= async (req: Request, res: Response) =>{
  const status:string=req.params.status;
  const id:string=req.params.id;
  // const updatedBy={
  //   account_id: res.locals.user.id,
  //   updatedAt: new Date()
  // }
  await User.updateOne({_id: id},
  { 
    status: status,
  });
  
  res.redirect("back");
}

//[PATCH] /admin/users/change-multi

export const changeMulti= async (req: Request, res: Response) =>{
  const type:string=req.body.type;
  const ids:string=req.body.ids.split(", ");
  // const updatedBy={
  //   account_id: res.locals.user.id,
  //   updatedAt: new Date()
  // }
  switch (type) {
    case "active":
      await User.updateMany( {_id: { $in: ids }}, {status: "active"});
      break;
    case "inactive":
      await User.updateMany( {_id: { $in: ids }}, {status: "inactive"});
      break;
    case "delete-all":
      await User.updateMany(
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
