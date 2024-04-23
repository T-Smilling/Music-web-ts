import { Request, Response } from "express";
import Role from "../../models/role.model";
import User from "../../models/user.model";

// [GET] /admin/accounts/
export const index = async (req: Request, res: Response) => {
  try {
    let find={
      deleted:false
    };
    const newRecord=[];
    const records=await User.find(find).select("-password -token");
    for(const record of records){
      newRecord.push({
        id:record.id,
        fullName: record.fullName, 
        email: record.email,
        status:record.status,
      });
    }
    res.render("admin/pages/users/index",{
      pageTitle:"Tài khoản User",
      records:newRecord
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};
