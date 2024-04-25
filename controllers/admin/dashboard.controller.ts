import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import Account from "../../models/accounts.model";
import User from "../../models/user.model";

// [GET] /admin/dashboard/
export const index = async (req: Request, res: Response) => {
  try {
    interface ObjectInStatic{
      total:Number,
      active:Number,
      inactive:Number
    }
    interface StaticObject{
      Topics:ObjectInStatic,
      Songs:ObjectInStatic,
      Singers:ObjectInStatic,
      Accounts:ObjectInStatic,
      Users:ObjectInStatic
    };
    const statistic:StaticObject={
      Topics:{
        total: 0,
        active: 0,
        inactive: 0
      },
      Songs:{
        total: 0,
        active: 0,
        inactive: 0
      },
      Singers:{
        total: 0,
        active: 0,
        inactive: 0
      },
      Accounts:{
        total: 0,
        active: 0,
        inactive: 0
      },
      Users:{
        total: 0,
        active: 0,
        inactive: 0
      },
    }
    statistic.Topics.total= await Topic.countDocuments({
      deleted:false
    });
    statistic.Topics.active= await Topic.countDocuments({
      deleted:false,
      status: "active"
    });
    statistic.Topics.inactive= await Topic.countDocuments({
      deleted:false,
      status: "inactive"
    });
    statistic.Songs.total= await Song.countDocuments({
      deleted:false
    });
    statistic.Songs.active= await Song.countDocuments({
      deleted:false,
      status: "active"
    });
    statistic.Songs.inactive= await Song.countDocuments({
      deleted:false,
      status:"inactive"
    });
    statistic.Singers.total= await Singer.countDocuments({
      deleted:false
    });
    statistic.Singers.active= await Singer.countDocuments({
      deleted:false,
      status:"active"
    });
    statistic.Singers.inactive= await Singer.countDocuments({
      deleted:false,
      status:"inactive"
    });
    statistic.Accounts.total= await Account.countDocuments({
      deleted:false
    });
    statistic.Accounts.active= await Account.countDocuments({
      deleted:false,
      status:"active"
    });
    statistic.Accounts.inactive= await Account.countDocuments({
      deleted:false,
      status:"inactive"
    });
    statistic.Users.total= await User.countDocuments({
      deleted:false
    });
    statistic.Users.active= await User.countDocuments({
      deleted:false,
      status:"active"
    });
    statistic.Users.inactive= await User.countDocuments({
      deleted:false,
      status:"inactive"
    });
  
    res.render("admin/pages/dashboard/index", {
      pageTitle: "Tổng quan",
      statistic:statistic
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};