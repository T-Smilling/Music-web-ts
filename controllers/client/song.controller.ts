import { Response,Request } from "express";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";


// [GET] /songs/:slugTopic
export const list = async (req:Request,res:Response) =>{
  try {
    const slugTopic:string=req.params.slugTopic;
    const topic=await Topic.findOne({
      slug:slugTopic,
      status:"active",
      deleted:false
    });
    const songs=await Song.find({
      topicId:topic.id,
      status:"active",
      deleted:false
    }).select("title avatar singerId like slug");

    for (const song of songs) {
      const infoSinger= await Singer.findOne({
        _id:song.singerId,
        status:"active",
        deleted:false
      });
      song["infoSinger"]=infoSinger;
    }
    res.render("client/pages/songs/list",{
      pageTitle:topic.title,
      songs:songs
    })
  } catch (error) {
    console.log(error);
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
}
//[GET] /songs/detail/:slugSongs
export const detailSong =async (req:Request,res:Response) =>{
  try {
    const id=res.locals.user.id;
    const slugSong:string=req.params.slugSongs;
    const song=await Song.findOne({
      slug:slugSong,
      status:"active",
      deleted:false
    });
    const singer=await Singer.findOne({
      _id:song.singerId,
      deleted:false
    }).select("fullName");
    const topic=await Topic.findOne({
      _id:song.topicId,
      deleted:false
    }).select("title");
    const favoriteSong=await FavoriteSong.findOne({
      userId:id,
      songId:song.id
    })
    song["isFavoriteSong"]=favoriteSong?true:false;

    res.render("client/pages/songs/detail",{
      pageTitle:song.title,
      song:song,
      singer:singer,
      topic:topic
    });
  } catch (error) {
    console.log(error);
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
}

// [PATCH] /songs/like/:type/:idSong
export const like=async (req:Request,res:Response)=>{
  try {
    const idSong:string=req.params.idSong;
    const type:string=req.params.type;
    const UserId:string=res.locals.user.id;
    // if(type == "yes") {
    //   await Song.updateOne({
    //     _id: idSong
    //   }, {
    //     $addToSet:{like:UserId}
    //   });
    // } else {
    //   await Song.updateOne({
    //     _id: idSong
    //   }, {
    //     $pull:{like:UserId}
    //   });
    // }
    let updateQuery;
  
    if (type === "yes") {
      updateQuery = { $addToSet: { like: UserId } };
    } else {
      updateQuery = { $pull: { like: UserId } };
    }
    const song = await Song.findByIdAndUpdate(
      idSong,
      updateQuery,
      { new: true, runValidators: true }
    );

    let updateLike:number=song.like.length;

    res.json({
      code: 200,
      message: "Thành công!",
      like: updateLike
  });
  } catch (error) {
    console.log(error);
    res.json({
      code: 404,
      message: "ERROR!",
    });
  }
}
// [PATCH] /songs/favorite/:type/:idSong
export const favorite=async (req:Request,res:Response)=>{
  try {
    const idSong:string=req.params.idSong;
    const type:string=req.params.type;
    const UserId:string=res.locals.user.id;

    if(type == "yes") {
      const existRecord=await FavoriteSong.findOne({
        userId:UserId,
        songId:idSong
      });
      if(!existRecord){
        const record=new FavoriteSong({
          userId:UserId,
          songId:idSong
        });
        await record.save();
      }
    } else {
      await FavoriteSong.deleteOne({
        userId:UserId,
        songId:idSong
      })
    }

    res.json({
      code: 200,
      message: "Thành công!",
  });
  } catch (error) {
    console.log(error);
    res.json({
      code: 404,
      message: "ERROR!",
    });
  }
}