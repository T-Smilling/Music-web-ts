import {Router} from "express";
const router:Router= Router();
import multer from "multer";
import * as controller from "../../controllers/admin/songs.controller";

import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

const upload = multer();

router.get("/",controller.index);
router.get("/create",controller.create);
router.post(
  "/create",
  upload.fields(
    [
      { name: 'avatar', maxCount: 1 },
      { name: 'audio', maxCount: 1 }
    ]
  ),
  uploadCloud.uploadFields,
  controller.createPost
);

router.get("/edit/:idSong",controller.edit);
router.patch(
  "/edit/:idSong",
  upload.fields(
    [
      { name: 'avatar', maxCount: 1 },
      { name: 'audio', maxCount: 1 }
    ]
  ),
  uploadCloud.uploadFields,
  controller.editPatch
);
router.get("/detail/:idSong",controller.detail);
router.delete("/delete/:idSong",controller.deleteSong);
router.patch("/change-multi",controller.changeMulti);
router.patch("/change-status/:status/:id",controller.changeStatus);

export const SongAdminRouter:Router=router;

