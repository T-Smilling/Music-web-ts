import { Request, Response } from "express";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/system";

// [GET] /admin/songs/
export const index = async (req: Request, res: Response) => {
  try {
    const songs=await Song.find({
      deleted:false
    });
    const newSongs=[];
    for (const song of songs) {
      const topic=await Topic.findOne({
        _id:song.topicId,
      }).select("title");
      const sing=await Singer.findOne({
        _id:song.singerId
      }).select("fullName");
      newSongs.push({
        id:song.id,
        title:song.title,
        avatar:song.avatar,
        like:song.like,
        status:song.status,
        slug:song.slug,
        topic:topic.title,
        singer:sing.fullName
      })
    }
    res.render("admin/pages/songs/index", {
      pageTitle: "Danh sách bài hát",
      songs:newSongs
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
    interface SaveBody{
      title: String,
      avatar: String,
      description: String,
      singerId: String,
      lyrics:String,
      audio:String,
      status:String,
      topicId: String,
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
    },data)
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
    },{deleted:true});
    res.redirect("back");
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};