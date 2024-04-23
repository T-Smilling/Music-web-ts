import {Router} from "express";
const router:Router= Router();

import * as controller from "../../controllers/client/user.controller";

router.get("/register",controller.register);
router.post("/register",controller.registerPost);
router.get("/login",controller.login);
router.post("/login",controller.loginPost);
router.get("/logout",controller.logout);
router.get("/password/forgot",controller.forgotPass);
router.post("/password/forgot",controller.forgotPassword);
router.post("/password/otp",controller.otp);
router.post("/password/reset",controller.resetPassword);

export const RouteUser=router;