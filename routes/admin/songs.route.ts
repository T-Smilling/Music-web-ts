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

export const SongAdminRouter:Router=router;

