import {Router} from "express";
const router:Router= Router();
import multer from "multer";
import * as controller from "../../controllers/admin/singer.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

const upload = multer();

router.get("/",controller.index);
router.get("/create",controller.create);
router.post("/create",controller.createPost);
router.get("/detail/:idSinger",controller.detail);
router.get("/edit/:idSinger",controller.edit);
router.patch(
  "/edit/:idSinger",
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.editPatch
);
router.delete("/delete/:idSinger",controller.deleteSinger);

export const SingerAdminRouter:Router=router;