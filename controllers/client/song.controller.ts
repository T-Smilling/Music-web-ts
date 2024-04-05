import { Response,Request } from "express";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";

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
    const slugSong:string=req.params.slugSongs;
    const song=await Song.findOne({
      slug:slugSong,
      status:"active",
      deleted:false
    });
    const singer=await Singer.findOne({
      _id:song.singerId,
      deleted:false
    });
    const topic=await Topic.findOne({
      _id:song.topicId,
      deleted:false
    });
  
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

// // [PATCH] /songs/like/:type/:idSong
// export const like=async (req:Request,res:Response)=>{
//   const idSong:string=req.params.idSong;
//   const type:string=req.params.type;

//   if(type == "yes") {
//     const existRecord = await FavoriteSong.findOne({
//       userId: "",
//       songId: idSong,
//     });

//     if(!existRecord) {
//       const record = new FavoriteSong({
//         userId: "",
//         songId: idSong,
//       });
//       await record.save();
//     }
//   } else {
//     await FavoriteSong.deleteOne({
//       userId: "",
//       songId: idSong
//     });
//   }

//   res.json({
//     code: 200,
//     message: "Thành công!"
//   });
// }
