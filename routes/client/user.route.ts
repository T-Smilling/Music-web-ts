import {Router} from "express";
const router:Router= Router();

import * as controller from "../../controllers/client/user.controller";
import * as authMiddleware from "../../middlewares/auth.middleware";

router.get("/register",controller.register);
router.post("/register",controller.registerPost);
router.get("/login",controller.login);
router.post("/login",controller.loginPost);
router.get("/logout",controller.logout);
router.post("/password/forgot",controller.forgotPassword);
router.post("/password/otp",controller.otp);
router.post("/password/reset",controller.resetPassword);
router.get("/detail",controller.detail);
router.get("/list",controller.list);

export const RouteUser=router;