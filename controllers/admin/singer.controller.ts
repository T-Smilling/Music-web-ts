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

// [GET] /admin/singers/detail/:idSinger
export const detail = async (req: Request, res: Response) => {
  try {
    const idSinger:string=req.params.idSinger;
    const singer=await Singer.findOne({
      _id:idSinger,
      deleted:false,
      status:"active"
    });
    res.render("admin/pages/singer/detail",{
      pageTitle:"Thông tin ca sĩ",
      singer:singer
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [GET] /admin/singers/edit/:idSinger
export const edit = async (req: Request, res: Response) => {
  try {
    const idSinger:string=req.params.idSinger;
    const singer=await Singer.findOne({
      _id:idSinger,
      deleted:false,
      status:"active"
    });
    res.render("admin/pages/singer/edit",{
      pageTitle:"Chỉnh sửa thông tin ca sĩ",
      singer:singer
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [PATCH] /admin/singers/edit/:idSinger
export const editPatch = async (req: Request, res: Response) => {
  try {
    const idSinger:string=req.params.idSinger;
    await Singer.updateOne({
      _id:idSinger
    },req.body);
    res.redirect("back");
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [DELETE] /admin/singers/delete/:idSinger
export const deleteSinger = async (req: Request, res: Response) => {
  try {
    const idSinger:string=req.params.idSinger;
    await Singer.updateOne({
      _id:idSinger
    },{deleted:true});
    res.redirect("back");
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};