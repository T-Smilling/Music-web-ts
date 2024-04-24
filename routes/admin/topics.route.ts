import {Router} from "express";
const router:Router= Router();
import multer from "multer";
import * as controller from "../../controllers/admin/topics.controller";
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";

const upload = multer();

router.get("/",controller.index);
router.get("/create",controller.create);
router.post(
  "/create",
  upload.fields(
    [
      { name: 'avatar', maxCount: 1 },
    ]
  ),
  uploadCloud.uploadFields,
  controller.createPost
);
router.get("/detail/:idTopic",controller.detail);
router.get("/edit/:idTopic",controller.edit);
router.patch(
  "/edit/:idTopic",
  upload.single("avatar"),
  uploadCloud.uploadSingle,
  controller.editPatch
);
router.delete("/delete/:idTopic",controller.deleteTopic);
router.patch("/change-status/:status/:id",controller.changeStatus);
router.patch("/change-multi",controller.changeMulti);

export const TopicAdminRouter:Router=router;