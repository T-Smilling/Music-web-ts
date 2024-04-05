import { Express } from "express";
import { TopicRoute } from "./topic.route";
import { SongRoute } from "./song.route";
import { SearchRoute } from "./search.route";

const ClientRoute = (app:Express) :void => {
  app.use("/topics",TopicRoute);
  app.use("/songs",SongRoute);
  app.use("/search",SearchRoute);
};

export default ClientRoute;
