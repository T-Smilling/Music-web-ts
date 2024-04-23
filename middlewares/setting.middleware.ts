import { NextFunction, Response,Request } from "express";
import Setting from "../models/setting.model";

export const SettingGeneral=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  const settingGeneral=await Setting.findOne({});
  res.locals.settingGeneral=settingGeneral;
  next();
}