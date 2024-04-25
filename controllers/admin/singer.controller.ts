import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/system";
import paginationHelper from "../../helpers/pagination.helper";
import { filterStatusHelper } from "../../helpers/filterStatus.helper";
import Account from "../../models/accounts.model";

// [GET] /admin/singers/
export const index = async (req: Request, res: Response) => {
  try {
    interface Find{
      deleted:boolean,
      status?:string|any,
      fullName?:RegExp
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
    const countTasks= await Singer.countDocuments(find);
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

    const singer = await Singer.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);

    for(const item of singer){
      const user=await Account.findOne({
        _id: item.createdBy.account_id
      });
      if(user){
        item["accountFullName"]=user.fullName;
      }
      const updatedBy=item.updatedBy.slice(-1)[0];
      if(updatedBy){
        const userUpdated=await Account.findOne({
          _id:updatedBy.account_id
        });
        updatedBy["accountFullName"]=userUpdated.fullName;
      }
    }

    res.render("admin/pages/singer/index",{
      pageTitle:"Danh sách ca sĩ",
      singers:singer,
      keyword:objectSearch.keyword,
      filterStatus:filterStatus,
      pagination:objectPagination,
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};


// [GET] /admin/singers/create
export const create = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/singer/create",{
      pageTitle:"Thêm mới ca sĩ",
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [POST] /admin/singers/create
export const createPost = async (req: Request, res: Response) => {
  try {
    req.body.createdBy={
      account_id: res.locals.user.id,
      createAt:new Date()
    }
    const singer= new Singer(req.body);
    await singer.save();
    res.redirect(`/${systemConfig.prefixAdmin}/singers`);
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [GET] /admin/singers/detail/:idSinger
export const detail = async (req: Request, res: Response) => {
  try {
    const idSinger:string=req.params.idSinger;
    const singer=await Singer.findOne({
      _id:idSinger,
      deleted:false,
      status:"active"
    });
    res.render("admin/pages/singer/detail",{
      pageTitle:"Thông tin ca sĩ",
      singer:singer
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [GET] /admin/singers/edit/:idSinger
export const edit = async (req: Request, res: Response) => {
  try {
    const idSinger:string=req.params.idSinger;
    const singer=await Singer.findOne({
      _id:idSinger,
      deleted:false,
      status:"active"
    });
    res.render("admin/pages/singer/edit",{
      pageTitle:"Chỉnh sửa thông tin ca sĩ",
      singer:singer
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [PATCH] /admin/singers/edit/:idSinger
export const editPatch = async (req: Request, res: Response) => {
  try {
    const idSinger:string=req.params.idSinger;
    const updatedBy={
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }
    await Singer.updateOne({
      _id:idSinger
    },{...req.body,
      $push:{updatedBy:updatedBy}});
    res.redirect("back");
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [DELETE] /admin/singers/delete/:idSinger
export const deleteSinger = async (req: Request, res: Response) => {
  try {
    const idSinger:string=req.params.idSinger;
    await Singer.updateOne({
      _id:idSinger
    },{deleted:true,deletedBy:{
      account_id:res.locals.user.id,
      deleteAt:new Date(),
  }});
    res.redirect("back");
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

//[PATCH] /admin/singers/change-status/:status/:id

export const changeStatus= async (req: Request, res: Response) =>{
  const status:string=req.params.status;
  const id:string=req.params.id;
  const updatedBy={
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }
  await Singer.updateOne({_id: id},
  { 
    status: status,
    $push:{updatedBy:updatedBy}
  });
  
  res.redirect("back");
}

//[PATCH] /admin/singers/change-multi

export const changeMulti= async (req: Request, res: Response) =>{
  const type:string=req.body.type;
  const ids:string=req.body.ids.split(", ");
  const updatedBy={
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }
  switch (type) {
    case "active":
      await Singer.updateMany( {_id: { $in: ids }}, {status: "active",$push:{updatedBy:updatedBy}});
      break;
    case "inactive":
      await Singer.updateMany( {_id: { $in: ids }}, {status: "inactive",$push:{updatedBy:updatedBy}});
      break;
    case "delete-all":
      await Singer.updateMany(
      {_id: { $in: ids }},
      {
        deleted: true,
        deletedBy:{
          account_id:res.locals.user.id,
          deletedAt: new Date(),
        }
      });
      break;
    default:
      break;
  }
  res.redirect("back");
}
