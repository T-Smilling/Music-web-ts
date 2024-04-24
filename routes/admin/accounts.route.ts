import {Router} from "express";
const router:Router= Router();

import * as controller from "../../controllers/admin/accounts.controller";

router.get("/",controller.index);
router.get("/create",controller.create);
router.post(
  "/create",
  controller.createPost
);
router.get("/detail/:idAccount",controller.detail);
router.get("/edit/:idAccount",controller.edit);
router.post("/edit/:idAccount",controller.editPost);
router.delete("/delete/:idAccount",controller.deleteAccount);
router.patch("/change-multi",controller.changeMulti);
router.patch("/change-status/:status/:id",controller.changeStatus);


export const AccountAdminRouter:Router=router;