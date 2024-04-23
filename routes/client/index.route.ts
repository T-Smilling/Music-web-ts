import { Express } from "express";
import { TopicRoute } from "./topic.route";
import { SongRoute } from "./song.route";
import { SearchRoute } from "./search.route";
import { RouteUser } from "./user.route";

import * as userMiddleware from "../../middlewares/user.middleware";
import { FavoriteRoute } from "./favorite-songs.route";
import * as SettingMiddleware from "../../middlewares/setting.middleware";

const ClientRoute = (app:Express) :void => {
  app.use(userMiddleware.infoUser);
  app.use(SettingMiddleware.SettingGeneral);
  app.use("/topics",TopicRoute);
  app.use("/songs",SongRoute);
  app.use("/search",SearchRoute);
  app.use("/user",RouteUser);
  app.use("/favorite-songs",FavoriteRoute);
};

export default ClientRoute;
