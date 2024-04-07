import { Response,Request } from "express";
import { convertToSlug } from "../../helpers/convert-to-slug.helper";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";


//[GET] /search/:type
export const search = async (req:Request,res:Response) =>{
  const type=req.params.type;
  const keyword:string= `${req.query.keyword}`;
  let songs=[];
  const newSongs=[];
  if(keyword){
    const keywordRegex=new RegExp(keyword,"i");
    const slug=convertToSlug(keyword);
    const keywordSlugRegex=new RegExp(slug,"i");
    
    songs = await Song.find({
      $or:[
        {title:keywordRegex},
        {slug:keywordSlugRegex},
      ]
    });
    if(songs.length>0){
      for (const song of songs) {
        const infoSinger = await Singer.findOne({
          _id:song.singerId,
          deleted:false,
        });
        newSongs.push({
          id:song.id,
          title:song.title,
          avatar:song.avatar,
          like:song.like,
          slug:song.slug,
          infoSinger:{
            fullName:infoSinger.fullName
          }
        });
      }
    }
  };

  switch (type) {
    case "result":
      res.render("client/pages/search/result",{
        pageTitle:`Kết quả tìm kiếm: ${keyword}`,
        keyword:keyword,
        songs:newSongs
      });
      break;
    case "suggest":
      res.json({
        code:200,
        message:"SUCCESS",
        songs:newSongs
      })
      break;
    default:
      break;
  }
}