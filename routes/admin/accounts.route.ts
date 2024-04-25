import {Router} from "express";
const router:Router= Router();
import multer from "multer";

import * as controller from "../../controllers/admin/accounts.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

const upload = multer();

router.get("/",controller.index);
router.get("/create",controller.create);
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.createPost
);
router.get("/detail/:idAccount",controller.detail);
router.get("/edit/:idAccount",controller.edit);
router.post(
  "/edit/:idAccount",
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.editPost
);
router.delete("/delete/:idAccount",controller.deleteAccount);
router.patch("/change-multi",controller.changeMulti);
router.patch("/change-status/:status/:id",controller.changeStatus);


export const AccountAdminRouter:Router=router;