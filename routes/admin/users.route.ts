import {Router} from "express";
const router:Router= Router();

import * as controller from "../../controllers/admin/users.controller";

router.get("/",controller.index);
router.get("/detail/:idUser",controller.detail);
router.get("/edit/:idUser",controller.edit);
router.post("/edit/:idUser",controller.editPost);
router.delete("/delete/:idUser",controller.deleteUser);
router.patch("/change-multi",controller.changeMulti);
router.patch("/change-status/:status/:id",controller.changeStatus);


export const UserAdminRouter:Router=router;