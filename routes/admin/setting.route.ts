import {Router} from "express";
const router:Router= Router();

import * as controller from "../../controllers/admin/setting.controller";

router.get("/general",controller.index);
router.patch("/general",controller.generalPatch);

export const SettingAdminRouter:Router=router;