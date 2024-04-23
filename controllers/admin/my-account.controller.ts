import { Request, Response } from "express";

// [GET] /admin/my-account
export const index = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/my-account/index",{
      pageTitle:"Thông tin cá nhân",
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};
// [GET] /admin/my-account/edit
export const edit = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/my-account/edit",{
      pageTitle:"Cập nhật tài khoản",
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};