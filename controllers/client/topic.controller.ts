import { Response,Request } from "express";
import Topic from "../../models/topic.model"

export const topic = async (req:Request,res:Response) =>{
  try {
    const topics=await Topic.find({
      deleted:false
    });
    res.render("client/pages/topic/index",{
      pageTitle:"Chủ đề bài hát",
      topics:topics
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
}