import {Router} from "express";
const router:Router= Router();

import * as controller from "../../controllers/client/song.controller";

router.get("/:slugTopic",controller.list);
router.get("/detail/:slugSongs",controller.detailSong);
// router.patch("/like/:type/:idSong",controller.like);

export const SongRoute=router;