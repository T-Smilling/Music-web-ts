import {Router} from "express";
const router:Router= Router();

import * as controller from "../../controllers/admin/users.controller";

router.get("/",controller.index);

export const UserAdminRouter:Router=router;