import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/system";

// [GET] /admin/singers/
export const index = async (req: Request, res: Response) => {
  try {
    const singer=await Singer.find({
      deleted:false,
      status:"active"
    });
    res.render("admin/pages/singer/index",{
      pageTitle:"Danh sách ca sĩ",
      singers:singer
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
    const singer= new Singer(req.body);
    await singer.save();
    res.redirect(`/${systemConfig.prefixAdmin}/singers`);
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};