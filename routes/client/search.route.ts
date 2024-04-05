import {Router} from "express";
const router:Router= Router();

import * as controller from "../../controllers/client/search.controller";

router.get("/result",controller.result);

export const SearchRoute=router;