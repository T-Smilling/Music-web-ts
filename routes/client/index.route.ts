import { Express } from "express";
import { TopicRoute } from "./topic.route";
import { SongRoute } from "./song.route";
import { SearchRoute } from "./search.route";
import { RouteUser } from "./user.route";

import * as userMiddleware from "../../middlewares/user.middleware";
import { FavoriteRoute } from "./favorite-songs.route";

const ClientRoute = (app:Express) :void => {
  app.use(userMiddleware.infoUser);

  app.use("/topics",TopicRoute);
  app.use("/songs",SongRoute);
  app.use("/search",SearchRoute);
  app.use("/user",RouteUser);
  app.use("/favorite-songs",FavoriteRoute);
};

export default ClientRoute;
