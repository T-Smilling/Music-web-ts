import { Request, Response } from "express";

import Role from "../../models/role.model";
import { systemConfig } from "../../config/system";

// [GET] /admin/roles
export const index = async (req: Request, res: Response) => {
  try {
    let find={
      deleted: false
    }
  
    const records=await Role.find(find);
    res.render("admin/pages/roles/index",{
      pageTitle:"Nhóm quyền",
      records: records
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [GET] /admin/roles/create
export const create = async (req: Request, res: Response) => {
  try {
    res.render("admin/pages/roles/create",{
      pageTitle:"Thêm mới",
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};
//[POST] admin/roles/craete
export const createPost = async (req: Request, res: Response) => {
  try {
    const records= new Role(req.body);
    await records.save();
    res.redirect(`/${systemConfig.prefixAdmin}/roles/permissions`);
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

//[GET] admin/roles/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const find = {
      deleted: false,
      _id: id
    };
    const record= await Role.findOne(find);
    res.render("admin/pages/roles/detail",{
      pageTitle:"Chi tiết quyền",
      record:record
    });
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
}
// [GET] /admin/roles
export const permissions = async (req: Request, res: Response) => {
  try {
    let find= {
      deleted: false
    };
    const records= await Role.find(find);
    res.render("admin/pages/roles/permissions" ,{
      pageTitle:"Phân quyền",
      records:records
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};
//[PATCH] admin/roles/permissions
export const permissionsPatch = async (req: Request, res: Response) => {
  try {
    const permissions=JSON.parse(req.body.permissions);
    for (const item of permissions) {
      await Role.updateOne({_id:item.id},{permissions: item.permissions});
    }
    res.redirect("back");
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
}
// [GET] /admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const idRole:string=req.params.id;
    let find= {
      _id:idRole,
      deleted: false
    };
    const records= await Role.findOne(find);
    res.render("admin/pages/roles/edit" ,{
      pageTitle:"Chỉnh sửa phân quyền",
      record:records
    })
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [PATCH] /admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const idRole:string=req.params.id;
    await Role.updateOne({
      _id:idRole
    },req.body);
    res.redirect("back");
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};

// [DELETE] /admin/roles/delete/:id
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const idRole:string=req.params.id;
    await Role.updateOne({
      _id:idRole
    },{deleted:true});
    res.redirect("back");
  } catch (error) {
    res.render("client/pages/errors/404",{
      pageTitle:"404 Not Fount",
    });
  }
};