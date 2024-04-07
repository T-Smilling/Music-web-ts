import {Router} from "express";
const router:Router= Router();

import * as controller from "../../controllers/client/favorite-songs.controller";

router.get("/",controller.index);

export const FavoriteRoute=router;