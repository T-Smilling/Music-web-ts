import { Response,Request } from "express";
import Song from "../../models/song.model";
import Setting from "../../models/setting.model";
import Singer from "../../models/singer.model";

//[GET] /
export const index = async (req:Request,res:Response) =>{
  try {
    const SongFeatured= await Song.find({
      featured: "1",
      deleted: false,
      status: "active"
    });
    for (const song of SongFeatured) {
      const infoSinger= await Singer.findOne({
        _id:song.singerId,
        status:"active",
        deleted:false
      });
      song["infoSinger"]=infoSinger;
    }
    const settingsGeneral= await Setting.findOne({});
    res.render("client/pages/homes/index",{
      pageTitle: settingsGeneral.websiteName,
      SongFeatured:SongFeatured
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
}