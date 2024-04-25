import { Request, Response } from "express";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/system";
import { filterStatusHelper } from "../../helpers/filterStatus.helper";
import paginationHelper from "../../helpers/pagination.helper";
import Account from "../../models/accounts.model";

// [GET] /admin/songs/
export const index = async (req: Request, res: Response) => {
  try {
    interface Find{
      deleted:boolean,
      status?:string|any,
      title?:RegExp,
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
    else {
      let position:string;
      sort[position]="desc";
    }
    //End Sort

    const songs = await Song.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
    const newSongs=[];
    for (const song of songs) {
      const topic=await Topic.findOne({
        _id:song.topicId,
      }).select("title");
      const sing=await Singer.findOne({
        _id:song.singerId
      }).select("fullName");

      const user=await Account.findOne({
        _id: song.createdBy.account_id
      });
      let accountFullName:string;
      if(user){
        accountFullName=user.fullName;
      }
      var updatedBy=song.updatedBy.slice(-1)[0];
      if(updatedBy){
        const userUpdated=await Account.findOne({
          _id:updatedBy.account_id
        });
        updatedBy.accountFullName=userUpdated.fullName;
      }
      newSongs.push({
        id:song.id,
        title:song.title,
        avatar:song.avatar,
        like:song.like,
        status:song.status,
        slug:song.slug,
        topic:topic.title,
        singer:sing.fullName,
        accountFullName:accountFullName,
        updatedBy:(updatedBy ? updatedBy:[])
      })
    }
    res.render("admin/pages/songs/index", {
      pageTitle: "Danh sách bài hát",
      songs:newSongs,
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
//[GET] /admin/songs/create
export const create = async (req: Request, res: Response) => {
  try {
    const topics = await Topic.find({
      deleted: false,
      status: "active"
    }).select("title");
  
    const singers = await Singer.find({
      deleted: false,
      status: "active"
    }).select("fullName");
  
    res.render("admin/pages/songs/create", {
      pageTitle: "Thêm mới bài hát",
      topics:topics,
      singers:singers
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [POST] /admin/songs/create
export const createPost = async (req: Request, res: Response) => {
  try {
    if(req.body.avatar) {
      req.body.avatar = req.body.avatar[0];
    }
  
    if(req.body.audio) {
      req.body.audio = req.body.audio[0];
    }
    req.body.createdBy={
      account_id: res.locals.user.id,
      createAt:new Date()
    }
    interface SaveBody{
      title: String,
      avatar: String,
      description: String,
      singerId: String,
      lyrics:String,
      audio:String,
      status:String,
      topicId: String,
      createdBy:{
        account_id: String,
        createAt:Date
      },
    };
  
    const data:SaveBody={
      title: req.body.title,
      avatar: req.body.avatar,
      description: req.body.description,
      singerId: req.body.singerId,
      topicId: req.body.topicId,
      lyrics: req.body.lyrics,
      audio: req.body.audio,
      status: req.body.status,
      createdBy:req.body.createdBy
    }
    const song = new Song(data);
    await song.save();
    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

//[GET] /admin/songs/edit/:idSong
export const edit = async (req: Request, res: Response) => {
  try {
    const idSong=req.params.idSong;
  
    const songs=await Song.findOne({
      _id:idSong,
      deleted:false
    })
  
    const topics = await Topic.find({
      deleted: false,
      status: "active"
    }).select("title");
  
    const singers = await Singer.find({
      deleted: false,
      status: "active"
    }).select("fullName");
  
    res.render("admin/pages/songs/edit", {
      pageTitle: "Thêm mới bài hát",
      song:songs,
      topics:topics,
      singers:singers
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};
// [PATCH] /admin/songs/edit/:idSong
export const editPatch = async (req: Request, res: Response) => {
  try {
    const idSong=req.params.idSong;
    const updatedBy={
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }
    interface SaveBody{
      title: String,
      avatar?: String,
      description: String,
      singerId: String,
      lyrics:String,
      audio?:String,
      status:String,
      topicId: String,
    };
  
    const data:SaveBody={
      title: req.body.title,
      description: req.body.description,
      singerId: req.body.singerId,
      topicId: req.body.topicId,
      lyrics: req.body.lyrics,
      status: req.body.status,
    }
    if(req.body.avatar) {
      data["avatar"] = req.body.avatar[0];
    }
  
    if(req.body.audio) {
      data["audio"]= req.body.audio[0];
    }
    await Song.updateOne({
      _id:idSong
    },{...data,$push:{updatedBy:updatedBy}})
    res.redirect("back");
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

//[GET] /admin/songs/detail/:idSong
export const detail = async (req: Request, res: Response) => {
  try {
    const idSong=req.params.idSong;
    const song=await Song.findOne({
      _id:idSong,
      deleted:false
    });
    const topic = await Topic.findOne({
      _id:song.topicId,
      deleted: false,
      status: "active"
    }).select("title");
  
    const singers = await Singer.findOne({
      _id:song.singerId,
      deleted: false,
      status: "active"
    }).select("fullName"); 

    interface GetData{
      title: String,
      avatar: String,
      description: String,
      singerId: String,
      lyrics:String,
      audio:String,
      status:String,
      topicId: String,
      listen:Number,
      like:Number,
    };

    const data:GetData={
      title: song.title,
      avatar: song.avatar,
      description: song.description,
      singerId: singers.fullName,
      topicId: topic.title,
      lyrics: song.lyrics,
      audio: song.audio,
      status: song.status,
      like:song.like.length,
      listen:song.listen
    }
    res.render("admin/pages/songs/detail", {
      pageTitle: "Chi tiết bài hát",
      data:data
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};
//[DELETE] /admin/songs/delete/:idSong
export const deleteSong = async (req: Request, res: Response) => {
  try {
    const idSong=req.params.idSong;
    await Song.updateOne({
      _id:idSong
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

//[PATCH] /admin/songs/change-status/:status/:id

export const changeStatus= async (req: Request, res: Response) =>{
  const status:string=req.params.status;
  const id:string=req.params.id;
  const updatedBy={
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }
  await Song.updateOne({_id: id},
  { 
    status: status,
    $push:{updatedBy:updatedBy}
  });
  
  res.redirect("back");
}

//[PATCH] /admin/songs/change-multi

export const changeMulti= async (req: Request, res: Response) =>{
  const type:string=req.body.type;
  const ids:string=req.body.ids.split(", ");
  const updatedBy={
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }
  switch (type) {
    case "active":
      await Song.updateMany( {_id: { $in: ids }}, {status: "active",$push:{updatedBy:updatedBy}});
      break;
    case "inactive":
      await Song.updateMany( {_id: { $in: ids }}, {status: "inactive",$push:{updatedBy:updatedBy}});
      break;
    case "delete-all":
      await Song.updateMany(
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
