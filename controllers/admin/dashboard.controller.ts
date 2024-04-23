import { Request, Response } from "express";

// [GET] /admin/dashboard/
export const index = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/dashboard/index", {
      pageTitle: "Tổng quan",
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};