import {Router} from "express";
const router:Router= Router();

import * as controller from "../../controllers/admin/accounts.controller";

router.get("/",controller.index);
router.get("/create",controller.create);
router.post(
  "/create",
  controller.createPost
);

export const AccountAdminRouter:Router=router;