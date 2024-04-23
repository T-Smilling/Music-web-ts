import { Request, Response } from "express";
import Setting from "../../models/setting.model";

// [GET] /admin/settings/general
export const index = async (req: Request, res: Response) => {
  try {
    const settingGeneral=await Setting.findOne({})
    res.render("admin/pages/settings/general",{
      pageTitle:"Cài đặt chung",
      settingGeneral:settingGeneral
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

//[PATCH] admin/settings/general
export const generalPatch = async (req: Request, res: Response) => {
  try {
    const setting=await Setting.findOne({});
    if(setting){
      await Setting.updateOne({
        _id:setting.id
      },req.body);
    }
    else{
      const record=new Setting(req.body);
      await record.save();
    }
    res.redirect("back");
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
}