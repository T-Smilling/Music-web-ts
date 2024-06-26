import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import paginationHelper from "../../helpers/pagination.helper";
import { filterStatusHelper } from "../../helpers/filterStatus.helper";
import { systemConfig } from "../../config/system";
import Account from "../../models/accounts.model";

// [GET] /admin/topics/
export const index = async (req: Request, res: Response) => {
  try {
    interface Find{
      deleted:boolean,
      status?:string|any,
      title?:RegExp
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
      find.title=regex;
    }
    //End Search

    //Pagination
    let initPagination={
      currentPage:1,
      limitItems:3,
    }
    const countTasks= await Topic.countDocuments(find);
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
    const topics = await Topic.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
    for(const topic of topics){
      const user=await Account.findOne({
        _id: topic.createdBy.account_id
      });
      if(user){
        topic["accountFullName"]=user.fullName;
      }
      const updatedBy=topic.updatedBy.slice(-1)[0];
      if(updatedBy){
        const userUpdated=await Account.findOne({
          _id:updatedBy.account_id
        });
        updatedBy["accountFullName"]=userUpdated.fullName;
      }
    }
    res.render("admin/pages/topics/index", {
      pageTitle: "Quản lý chủ đề",
      topics: topics,
      keyword:objectSearch.keyword,
      filterStatus:filterStatus,
      pagination:objectPagination,
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [GET] /admin/topics/cretae
export const create = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/topics/create", {
      pageTitle: "Thêm mới chủ đề",
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [POST] /admin/topics/cretae
export const createPost = async (req: Request, res: Response) => {
  try {
    req.body.avatar=req.body.avatar[0];
    req.body.createdBy={
      account_id: res.locals.user.id,
      createAt:new Date()
    }
    const record=new Topic(req.body);
    await record.save();
    res.redirect(`/${systemConfig.prefixAdmin}/topics`);
  } catch (error) {
    console.log(error);
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [GET] /admin/topics/detail/:idTopic
export const detail = async (req: Request, res: Response) => {
  try {
    const idTopic:string=req.params.idTopic;
    const topic=await Topic.findOne({
      _id:idTopic,
      deleted:false
    });
    res.render("admin/pages/topics/detail", {
      pageTitle: "Chi tiết chủ đề",
      topic: topic
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [GET] /admin/topics/edit/:idTopic
export const edit = async (req: Request, res: Response) => {
  try {
    const idTopic:string=req.params.idTopic;
    const topic=await Topic.findOne({
      _id:idTopic,
      deleted:false
    });
    res.render("admin/pages/topics/edit", {
      pageTitle: "Chỉnh sửa chủ đề",
      topic: topic
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [PATCH] /admin/topics/edit/:idTopic
export const editPatch = async (req: Request, res: Response) => {
  try {
    const idTopic:string=req.params.idTopic;
    const updatedBy={
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }
    await Topic.updateOne({
      _id:idTopic
    },{
      ...req.body,
      $push:{updatedBy:updatedBy}
    });
    res.redirect("back");
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};
// [DELETE] /admin/topics/delete/:idTopic
export const deleteTopic = async (req: Request, res: Response) => {
  try {
    const idTopic:string=req.params.idTopic;
    await Topic.updateOne({
      _id:idTopic
    },{deleted:true,
      deletedBy:{
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


//[PATCH] /admin/topics/change-status/:status/:id

export const changeStatus= async (req: Request, res: Response) =>{
  const status:string=req.params.status;
  const id:string=req.params.id;
  const updatedBy={
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }
  await Topic.updateOne({_id: id},
  { 
    status: status,
    $push:{updatedBy:updatedBy}
  });
  
  res.redirect("back");
}

//[PATCH] /admin/topics/change-multi

export const changeMulti= async (req: Request, res: Response) =>{
  const type:string=req.body.type;
  const ids:string=req.body.ids.split(", ");
  const updatedBy={
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }
  switch (type) {
    case "active":
      await Topic.updateMany( {_id: { $in: ids }}, {status: "active",$push:{updatedBy:updatedBy}});
      break;
    case "inactive":
      await Topic.updateMany( {_id: { $in: ids }}, {status: "inactive",$push:{updatedBy:updatedBy}});
      break;
    case "delete-all":
      await Topic.updateMany(
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
