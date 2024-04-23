import {Router} from "express";
const router:Router= Router();

import * as controller from "../../controllers/admin/my-account.controller";

router.get("/",controller.index);
router.get("/edit",controller.edit);

export const MyAccountAdminRouter:Router=router;